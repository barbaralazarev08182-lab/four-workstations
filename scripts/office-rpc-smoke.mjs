import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(fileName) {
  const envPath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function expectedError(error, marker, label) {
  assert(error, `${label}: expected an error`);
  assert(error.message.includes(marker), `${label}: expected ${marker}, got ${error.message}`);
}

loadEnvFile(".env.local");
loadEnvFile(".env.office-test.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
assert(url && key, "Missing public Supabase environment variables");

const accountNames = ["A", "B", "C", "D", "E"];
const credentials = accountNames.map((name) => ({
  name,
  email: process.env[`OFFICE_TEST_${name}_EMAIL`],
  password: process.env[`OFFICE_TEST_${name}_PASSWORD`],
}));
assert(
  credentials.every((item) => item.email && item.password),
  "Set OFFICE_TEST_A_EMAIL/PASSWORD through OFFICE_TEST_E_EMAIL/PASSWORD in .env.office-test.local. Values are never printed.",
);

function client() {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

const actors = [];
for (const credential of credentials) {
  const supabase = client();
  const { data, error } = await supabase.auth.signInWithPassword({ email: credential.email, password: credential.password });
  assert(!error && data.user, `Account ${credential.name} could not sign in: ${error?.message ?? "missing user"}`);
  actors.push({ name: credential.name, supabase, user: data.user });
}

const [a, b, c, d, e] = actors;
const officeName = `四人工位联机测试 ${new Date().toISOString().slice(11, 19)}`;
const { data: createRows, error: createError } = await a.supabase.rpc("create_office", { p_name: officeName });
assert(!createError && createRows?.[0], `Create failed: ${createError?.message ?? "missing result"}`);
const office = createRows[0];
assert(office.desk_key === "desk_1", "Owner was not assigned desk_1");

const { error: secondCreateError } = await a.supabase.rpc("create_office", { p_name: "不应创建成功" });
expectedError(secondCreateError, "already_in_office", "duplicate membership");

const { data: previewRows, error: previewError } = await b.supabase.rpc("preview_office_by_invite_code", { p_invite_code: office.invite_code });
assert(!previewError && previewRows?.[0], `Preview failed: ${previewError?.message ?? "missing result"}`);
assert(previewRows[0].current_member_count === 1, "Preview member count should be 1");
assert(previewRows[0].available_desks.join(",") === "desk_2,desk_3,desk_4", "Preview leaked or returned incorrect desks");

const concurrent = await Promise.all([
  b.supabase.rpc("join_office", { p_invite_code: office.invite_code, p_desk_key: "desk_2" }),
  c.supabase.rpc("join_office", { p_invite_code: office.invite_code, p_desk_key: "desk_2" }),
]);
const winners = concurrent.filter((result) => !result.error);
const losers = concurrent.filter((result) => result.error);
assert(winners.length === 1 && losers.length === 1, "Concurrent desk_2 claim did not produce exactly one winner");
expectedError(losers[0].error, "desk_is_taken", "concurrent desk claim");
const loserActor = concurrent[0].error ? b : c;
const { error: loserJoinError } = await loserActor.supabase.rpc("join_office", { p_invite_code: office.invite_code, p_desk_key: "desk_3" });
assert(!loserJoinError, `Loser could not join desk_3: ${loserJoinError?.message}`);

const { error: dJoinError } = await d.supabase.rpc("join_office", { p_invite_code: office.invite_code, p_desk_key: "desk_4" });
assert(!dJoinError, `D could not join desk_4: ${dJoinError?.message}`);

const { error: fullPreviewError } = await e.supabase.rpc("preview_office_by_invite_code", { p_invite_code: office.invite_code });
expectedError(fullPreviewError, "office_is_full", "full office preview");
const { error: fifthJoinError } = await e.supabase.rpc("join_office", { p_invite_code: office.invite_code, p_desk_key: "desk_4" });
expectedError(fifthJoinError, "office_is_full", "fifth member join");
const { error: invalidPreviewError } = await e.supabase.rpc("preview_office_by_invite_code", { p_invite_code: "AAAAA0" });
expectedError(invalidPreviewError, "invalid_invite_code", "invalid invite");

const { error: forgedOwnerError } = await e.supabase.from("offices").insert({ name: "伪造办公室", invite_code: "ABCDEF", owner_id: a.user.id });
assert(forgedOwnerError, "Direct office insert unexpectedly succeeded");

const winnerActor = concurrent[0].error ? c : b;
const { error: deskUpdateError } = await winnerActor.supabase.from("office_members").update({ desk_key: "desk_4" }).eq("user_id", a.user.id);
assert(deskUpdateError, "Direct member desk update unexpectedly succeeded");

const { data: outsiderOffices, error: outsiderOfficeError } = await e.supabase.from("offices").select("id,name").eq("id", office.office_id);
assert(!outsiderOfficeError && outsiderOffices.length === 0, "Outsider could read office data");
const { data: outsiderMembers, error: outsiderMemberError } = await e.supabase.from("office_members").select("office_id,user_id,desk_key").eq("office_id", office.office_id);
assert(!outsiderMemberError && outsiderMembers.length === 0, "Outsider could read member data");

const { data: members, error: membersError } = await a.supabase.from("office_members").select("office_id,user_id,desk_key,role").eq("office_id", office.office_id).order("desk_key");
assert(!membersError && members.length === 4, "Office does not contain exactly four members");
assert(members.map((member) => member.desk_key).join(",") === "desk_1,desk_2,desk_3,desk_4", "Desk mapping is incorrect");
assert(members[0].user_id === a.user.id && members[0].role === "owner", "Owner identity or role is incorrect");

const { data: statuses, error: statusesError } = await a.supabase.from("current_status").select("office_id,user_id,status").eq("office_id", office.office_id);
assert(!statusesError && statuses.length === 4 && statuses.every((row) => row.status === "offWork"), "Default current_status rows are incorrect");

const { data: profiles, error: profilesError } = await a.supabase.from("profiles").select("id,nickname").in("id", members.map((member) => member.user_id));
assert(!profilesError && profiles.length === 4, "Member profile mapping is incomplete");

console.log(JSON.stringify({
  create_owner_desk_1: true,
  preview_minimal_data: true,
  concurrent_desk_claim: true,
  four_unique_desks: true,
  fifth_member_blocked: true,
  invalid_invite_hidden: true,
  duplicate_membership_blocked: true,
  owner_forgery_blocked: true,
  member_desk_update_blocked: true,
  outsider_reads_blocked: true,
  four_default_statuses: true,
  four_profiles_visible_to_peers: true,
}, null, 2));

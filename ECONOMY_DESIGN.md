# 经济设计 · Economy Design

## 核心货币：工票

| 属性 | 规则 |
|------|------|
| 名称 | 工票（Work Ticket）|
| 符号 | 🎫 |
| 获取方式 | 保持活跃状态自动累积 |
| 活跃状态 | clockedIn, working, studying, busy, overtime |
| 获取速率 | 每整小时 1 工票（按分钟累积，不足 1 分钟不发放）|
| 每日上限 | 8 工票 / 人 / 日（UTC+8 自然日）|
| 离线加速 | 无。仅在线有效时间累积 |
| 重复冷却 | 同一 event_id 幂等，重复提交不增加余额 |

## 价格档位

| 档位 | 价格 | 商品类型 |
|------|------|----------|
| 免费 | 0 | 基础表情、文字消息 |
| 便宜 | 1-2 工票 | 肠粉零食、简单装饰 |
| 中等 | 3-5 工票 | 桌面摆件、壁纸 |
| 较贵 | 6-10 工票 | 特殊家具、皮肤配件 |
| 奢侈 | 10+ 工票 | 限定装饰、场景解锁贡献 |

## 初始商品分类

| 分类 | 示例 | 首版数量 |
|------|------|----------|
| 肠粉用品 | 猫粮、玩具老鼠、逗猫棒、小枕头 | 5 |
| 桌面摆件 | 小绿植、相框、杯子、书本 | 6 |
| 个人皮肤 | 4 人 Q 版服装配色 | 3 |
| 共享家具 | 办公室挂画、地毯、灯具 | 3 |
| 场景解锁 | 棋牌室（公共基金达标） | 1 |

## 用户库存

- 每用户独立 `user_inventory` 表
- 物品拥有数量、获取时间
- 肠粉用品在使用后减少计数（消耗品）
- 桌面摆件可重复摆放，不可消耗
- 皮肤类永久解锁

## 家具摆放

```
摆放流程：
1. 从库存选择物品 → 进入放置模式
2. 桌面：在个人 desk 区域拖放（仅自己和访客可见）
3. 共享区域：提交 placement 事件（所有人可见）
4. 每人最多 3 件共享家具同时摆放
5. 撤回：物品回到库存，不退款
```

## 肠粉用品

- 所有人可购买和喂食
- 喂食后肠粉短暂表现开心动画（蹭人、呼噜）
- 肠粉饱食度有上限（显示为小进度条）
- 过度喂食无惩罚，但饱食状态下不接受新食物
- 肠粉玩具使用后，肠粉在附近随机活动 2 分钟

## 办公室公共基金

| 属性 | 规则 |
|------|------|
| 来源 | 每人每次获取工票时，10% 进入公共基金 |
| 用途 | 解锁新场景、购买共享家具、办公室装修 |
| 决策 | 需 ≥2 人投票同意支出 |
| 可见性 | 基金余额对全员可见 |

## 棋牌室奖励与消费

| 项目 | 规则 |
|------|------|
| 入场费 | 1 工票 / 次 |
| 在线奖励 | 在棋牌室满 30 分钟，获得 0.5 工票返还 |
| 每日入场上限 | 3 次 / 人 |
| 社交奖励 | 2 人同时在棋牌室时每人额外 +1 工票（每日 1 次）|

## 场景解锁

| 场景 | 解锁条件 |
|------|----------|
| 棋牌室 | 公共基金 ≥20 工票，≥2 人投票同意 |
| 咖啡休息室 | 棋牌室已解锁 + 公共基金 ≥30 |
| 天台花园 | 公共基金 ≥50 + 全员投票（≥3 票）|
| 肠粉小屋 | 肠粉被喂食 ≥30 次 + 公共基金 ≥10 |

## 货币流水

所有交易写入 `transaction_ledger`，不可篡改：

| 字段 | 说明 |
|------|------|
| id | UUID |
| office_id | 所属办公室 |
| user_id | 操作用户（收入/支出）|
| type | earn / spend / refund / fund_donate / fund_spend |
| amount | 数量（正=收入，负=支出）|
| item_id | 关联商品（可为 null）|
| event_id | 幂等事件 ID |
| balance_after | 操作后余额（快照）|
| created_at | 服务端时间 |

## 防刷、幂等与并发

### 服务端权威

所有货币操作必须通过 RPC 函数，客户端不得直接写入余额或库存表。

| 规则 | 实现 |
|------|------|
| 收益由服务端计算 | RPC `earn_ticket` 不接受 amount 参数；服务端根据在线时长和状态计算应发数量 |
| 每日上限在数据库层面检查 | `SELECT SUM(amount) FROM transaction_ledger WHERE user_id = $1 AND type = 'earn' AND created_at >= today()` → 验证 + 新值 ≤ 8 |
| 余额不能为负 | `CHECK(balance >= 0)` 约束 |
| 客户端只提交意图 | 客户端发送 `{action, event_id}` 而非 `{action, amount, event_id}` |

### 幂等性

每个经济事件必须有全局唯一的 `event_id`，格式建议：`{user_id}:{action}:{timestamp_ms}:{random}`。

| 规则 | 实现 |
|------|------|
| 重复 event_id 拒绝 | `UNIQUE(event_id)` 约束；重复提交返回已有结果而非报错 |
| 幂等窗口 | event_id 永久唯一，不做过期清理 |
| 客户端重试安全 | 网络超时后客户端可用相同 event_id 重试，服务端返回首次执行结果 |
| 查询幂等结果 | RPC 返回 `{success, balance, event_id, already_processed}` |

### 并发控制

第一版为四人低并发经济系统，优先使用简单可靠的机制：

| 场景 | 风险 | 第一版解决方案 |
|------|------|----------|
| 并发购买同一限量物品 | 超卖 | `UNIQUE(user_id, item_id)` 库存约束 + RPC 事务内 `INSERT ... ON CONFLICT DO NOTHING` |
| 并发 earn_ticket | 余额计算竞态 | `UPDATE user_wallets SET balance = balance + $1 WHERE user_id = $2`（原子操作） |
| 并发 spend | 余额透支 | `UPDATE ... SET balance = balance - $1 WHERE user_id = $2 AND balance >= $1`（条件扣款） |
| 并发 spend + earn | 余额不一致 | 所有余额变更走同一张表的原子 UPDATE，失败整体回滚 |
| 并发公共基金支出投票 | 超额支出 | RPC 事务内原子 UPDATE + `WHERE balance >= amount` 条件 |
| 并发场景解锁投票 | 重复解锁 | `INSERT ... ON CONFLICT DO NOTHING` + 前置条件检查 |

**未来评估方案（不作为当前既定实现）**：
- `SELECT ... FOR UPDATE` 行级锁
- `pg_advisory_xact_lock`

以上两种方案在四人低并发场景下大概率不需要。如未来扩展到更大规模或出现实际竞态问题，再评估引入。

### 退款与安全

| 规则 | 实现 |
|------|------|
| 退款窗口 | 购买后 5 分钟内可退：`created_at > NOW() - INTERVAL '5 minutes'` |
| 退款写反向流水 | 退款不删除原记录，而是写入 type='refund' 的新行 |
| 已使用物品不可退 | 肠粉用品一旦喂食、家具一旦摆放，不可退款 |
| 余额快照 | 每笔交易记录 `balance_after`，可用于审计和对账 |

### 防刷具体策略

| 攻击方式 | 防御 |
|----------|------|
| 多标签页重复 earn | event_id 幂等 + 服务端时间窗口检查 |
| 脚本高频调用 earn | 服务端限制每用户每分钟最多 1 次 earn 调用 |
| 虚假状态切换刷票 | 状态切换需有最小持续时间（如 working ≥5 分钟才计入） |
| 并发购买刷库存 | UNIQUE 库存约束 + 条件扣款 + 事务回滚 |
| 负数金额注入 | RPC 参数校验 + CHECK 约束 |
| 公共基金超额支出 | 原子操作 + 余额前置检查 |

## 未来 Supabase 表草案

```sql
-- 用户钱包
CREATE TABLE user_wallets (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  balance INT NOT NULL DEFAULT 0 CHECK (balance >= 0),
  daily_earned INT NOT NULL DEFAULT 0,
  last_earn_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 交易流水
CREATE TABLE transaction_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID NOT NULL,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  amount INT NOT NULL,
  item_id UUID,
  event_id TEXT NOT NULL UNIQUE,
  balance_after INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 商品
CREATE TABLE shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INT NOT NULL,
  stock_type TEXT NOT NULL DEFAULT 'unlimited',
  is_active BOOLEAN DEFAULT true
);

-- 用户库存
CREATE TABLE user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  item_id UUID NOT NULL REFERENCES shop_items(id),
  quantity INT NOT NULL DEFAULT 1,
  acquired_at TIMESTAMPTZ DEFAULT now()
);

-- 公共基金
CREATE TABLE office_fund (
  office_id UUID PRIMARY KEY,
  balance INT NOT NULL DEFAULT 0 CHECK (balance >= 0)
);

-- 场景解锁
CREATE TABLE scene_unlocks (
  office_id UUID NOT NULL,
  scene_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (office_id, scene_key)
);
```

## V1 明确不做

- 棋牌室完整经济
- 场景解锁 UI
- 家具拖放摆放系统
- 复杂定价策略
- 工票交易/转账
- 排行榜
- 付费购买工票
- 抽奖/开箱
- 用户间交易
- 肠粉好感度数值系统

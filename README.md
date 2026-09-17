# 小红书内容项目

## 角色

Chat A：执行编辑
Chat B：策划评审

## 工作原则

B负责：
- 选题
- 策划
- 评审
- 复盘

A负责：
- 写作
- 配图
- 修改
- 最终发布材料

## 文件流程

01-plan.md
↓
02-draft.md
↓
03-review.md
↓
04-revision.md
↓
05-final.md
↓
06-publish-record.md

## 完整 A/B 工作顺序
                B
            维护选题池
                ↓
          选择下一篇选题
                ↓
          写 01-plan.md
                ↓
                A
          读取策划文件
                ↓
        写 02-draft.md
                ↓
        制作配图/提示词
                ↓
                B
          审核完整初稿
                ↓
        写 03-review.md
                ↓
        ┌──── PASS ────┐
        │              │
       FAIL           PASS
        ↓              ↓
        A              A
  写04-revision     写05-final
        ↓              ↓
        B            发布准备
      复审             ↓
        ↓            发布
      PASS             ↓
        ↓        06-publish-record
        A              ↓
   写05-final          B
                    数据复盘
                        ↓
                  更新全局规则
                        ↓
                    下一篇

## 谁拥有最终决策权？
选题决策权
→ B

内容结构决策权
→ B

具体表达方式
→ A

图片制作方式
→ A

内容质量验收
→ B

最终文件整理
→ A

是否发布
→ 你

## 最多修改轮次
初稿
↓
Review 1
↓
修改
↓
Review 2
↓
Final

## 项目里的版本规则
V0
策划稿

V1
A第一版

V2
第一次修改

V3
特殊情况下第二次修改

FINAL
发布稿

## A/B 每次交接，都必须在文件最后写
---

# HANDOFF

From:
Chat B

To:
Chat A

Current Status:
PLANNING_COMPLETE

Completed:
- 选题确认
- 内容结构确认
- 标题方向确认

Next Action:
根据本文件完成第一版笔记。

Required Files:
- README.md
- CONTENT_RULES.md
- 01-plan.md

Expected Output:
02-draft.md

Do Not:
不要修改选题核心方向。
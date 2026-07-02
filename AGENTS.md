# Repository Instructions

## Skill Creation

- Create new skills as directories under this repository.
- When creating a skill, investigate available APIs and tools that can streamline the skill's workflow before implementing custom logic.
- Before creating a skill, check whether the intended skill overlaps with an existing skill.
- If the intended skill, a new skill, or an existing skill duplicates another skill, compare them and keep the better version as the source of truth. Improve the retained skill with any useful parts from the weaker duplicate, then remove the weaker duplicate once it is safe to do so.
- After creating a skill, add a symbolic link from this project's `.agents/skills/<skill-name>` to the skill directory in this repository.
- Example:

```bash
ln -s ../../<skill-name> .agents/skills/<skill-name>
```

- If the destination link already exists, inspect it before changing it. Do not overwrite an existing skill or link without confirming that it points to the intended location.

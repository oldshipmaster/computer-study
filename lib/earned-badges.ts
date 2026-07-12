interface BadgeDefinition {
  badgeId: string;
  badgeName: string;
}

export interface EarnedBadge {
  id: string;
  name: string;
}

export function buildEarnedBadges(
  completedCourseIds: readonly string[],
  definitions: Readonly<Record<string, BadgeDefinition>>,
): EarnedBadge[] {
  const seen = new Set<string>();
  const badges: EarnedBadge[] = [];

  for (const courseId of completedCourseIds) {
    const definition = definitions[courseId];

    if (!definition || seen.has(definition.badgeId)) continue;

    seen.add(definition.badgeId);
    badges.push({ id: definition.badgeId, name: definition.badgeName });
  }

  return badges;
}

export type AvailabilityStatusLike = 'LIVE' | 'STAGED' | 'NOT_LIVE' | 'UNKNOWN';

export type RequirementLike = {
  osName: string;
  osMin?: string | null;
  appVersionMin?: string | null;
  accountFlag?: string | null;
};

export type CheckInput = {
  osName: string;
  osVersion?: string;
  appVersion?: string;
  availability?: AvailabilityStatusLike | null;
  requirements: RequirementLike[];
};

export type CheckResultStatus = 'LIKELY' | 'STAGED' | 'NOT_YET' | 'UNKNOWN';

export type CheckResult = {
  status: CheckResultStatus;
  reasons: string[];
  matchingRequirements: RequirementLike[];
};

export function compareVersions(userVersion: string | undefined, minVersion: string | null | undefined) {
  if (!userVersion || !minVersion) return true;
  const normalize = (input: string) => input.split('.').map((value) => parseInt(value, 10));
  const a = normalize(userVersion);
  const b = normalize(minVersion);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff > 0) return true;
    if (diff < 0) return false;
  }
  return true;
}

export function evaluateCheck({ osName, osVersion, appVersion, availability, requirements }: CheckInput): CheckResult {
  const reasons: string[] = [];
  const matches = requirements.filter((req) => req.osName.toLowerCase() === osName.toLowerCase());

  if (matches.length === 0) {
    reasons.push('No requirement matches your operating system yet.');
  }

  for (const requirement of matches) {
    if (!compareVersions(osVersion, requirement.osMin)) {
      reasons.push(`Requires ${requirement.osName} ${requirement.osMin}+`);
    }
    if (requirement.appVersionMin && !compareVersions(appVersion, requirement.appVersionMin)) {
      reasons.push(`Requires app version ${requirement.appVersionMin}+`);
    }
    if (requirement.accountFlag) {
      reasons.push(`Account flag: ${requirement.accountFlag}`);
    }
  }

  let status: CheckResultStatus = 'UNKNOWN';
  if (availability === 'LIVE') {
    status = reasons.length === 0 ? 'LIKELY' : 'NOT_YET';
  } else if (availability === 'STAGED') {
    status = 'STAGED';
  } else if (availability === 'NOT_LIVE') {
    status = 'NOT_YET';
  } else {
    status = reasons.length > 0 ? 'NOT_YET' : 'UNKNOWN';
  }

  return { status, reasons, matchingRequirements: matches };
}

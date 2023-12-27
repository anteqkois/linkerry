type Props = Record<string, any>;

export const deepMerge = <T extends Props>(target: T, ...sources: Props[]): T => {
  if (!sources.length) {
    return target;
  }

  Object.entries(sources.shift() ?? []).forEach(([key, value]) => {
    if (!target[key]) {
      Object.assign(target, { [key]: {} });
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      deepMerge(target[key], value);
    } else if (Array.isArray(value)) {
      Object.assign(target, {
        [key]: value.some((v) => typeof v === 'object') ? target[key].concat(value) : [...new Set([...target[key], ...value])],
      });
    } else {
      Object.assign(target, { [key]: value });
    }
  });

  return target;
};

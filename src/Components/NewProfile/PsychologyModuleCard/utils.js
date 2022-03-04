export const mergePsyco = (all, currents) =>
  all.map((e) => {
    const matched = currents.find((i) => i.identifier === e.identifier);
    return {
      ...e,
      ...(matched ? { ...matched } : { value: 50 }),
    };
  });

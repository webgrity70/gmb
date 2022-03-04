export default (prompts) =>
  prompts.map((e, index) => {
    const prompt = typeof e === 'object' ? e.prompt : e;
    return `${index + 1}. ${prompt}`;
  });

export default (prompts) =>
  prompts.map((e) => {
    const prompt = typeof e === 'object' ? e.prompt : e;
    return prompt;
  });

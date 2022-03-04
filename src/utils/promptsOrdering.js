export const orderFetchedPrompts = (prompts) => {
  if (Array.isArray(prompts) && prompts.length > 0) {
    prompts = prompts.map((item, index) => {
      if (item.prompt) {
        let promptArray = item.prompt.split(')))... ');
        if (promptArray[1]) {
          item.sortOrder = promptArray[0];
          item.prompt = promptArray[1];
        } else {
          item.sortOrder = prompts.length + index + 1;
        }
      }
      return item;
    });
    prompts.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return prompts;
};

export const orderPromptsToSave = (prompts) => {
  if (Array.isArray(prompts) && prompts.length > 0) {
    prompts = prompts.map((e, index) => {
      let prompt = typeof e === 'object' ? e.prompt : e;
      prompt = index + 1 + ')))... ' + prompt;
      return prompt;
    });
  }
  return prompts;
};

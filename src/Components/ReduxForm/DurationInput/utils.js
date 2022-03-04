export const getHourOptions = (onChange, value, full) =>
  Array.from(Array(full ? 24 : 13).keys())
    .map((n) => {
      const val = n.toString();
      return {
        key: val,
        text: val,
        value: val,
        onClick: onChange,
      };
    })
    .filter((e) => new RegExp(value, 'ig').test(e.value));

export const getMinutesOptions = (onChange, value) => {
  const options = [
    {
      key: '0',
      value: '00',
      text: '00',
      onClick: onChange,
    },
    {
      key: '5',
      value: '05',
      text: '05',
      onClick: onChange,
    },
    {
      key: '10',
      value: '10',
      text: '10',
      onClick: onChange,
    },
    {
      key: '15',
      value: '15',
      text: '15',
      onClick: onChange,
    },
    {
      key: '30',
      value: '30',
      text: '30',
      onClick: onChange,
    },
    {
      key: '35',
      value: '35',
      text: '35',
      onClick: onChange,
    },
    {
      key: '40',
      value: '40',
      text: '40',
      onClick: onChange,
    },
    {
      key: '45',
      value: '45',
      text: '45',
      onClick: onChange,
    },
    {
      key: '50',
      value: '50',
      text: '50',
      onClick: onChange,
    },
    {
      key: '55',
      value: '55',
      text: '55',
      onClick: onChange,
    },
  ];
  const exist = options.find((e) => e.value === value || e.key === value);
  if (value && !exist) {
    const newValue =
      value.toString().length === 1 ? `0${value}` : value.toString();
    options.push({
      key: newValue,
      value,
      text: newValue,
      onClick: () => onChange(null, { value: newValue }),
    });
  }
  return options
    .filter((e) => new RegExp(value, 'ig').test(e.value))
    .sort((a, b) => (Number(a.value) > Number(b.value) ? 1 : -1));
};

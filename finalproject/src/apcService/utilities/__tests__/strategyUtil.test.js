const steakStrategy = require('../strategyUtil');

describe('Module strategyUtil', () => {
  const fakeThickness = 2.0;
  const fakeMoisture = 0.65;
  const fakeTFactor = 0.5;
  const fakeMFactor = 0.5;

  it('Method sharonStrategy', () => {
    const res = new steakStrategy.sharonStrategy({'thickness': fakeThickness}, {'tFactor': fakeTFactor}).getInfo();

    expect(res).toStrictEqual({
      period: 20,
      temperature: (fakeThickness * fakeTFactor).toFixed(2),
    });
  });

  it('Method defaultStrategy', () => {
    const res = new steakStrategy.defaultStrategy({'moisture': fakeMoisture}, {'mFactor': fakeMFactor}).getInfo();

    expect(res).toStrictEqual({
      period: (fakeMoisture * fakeMFactor).toFixed(2),
      temperature: 100,
    });
  });

  it('Method stripStrategy', () => {
    const res = new steakStrategy.stripStrategy({'thickness': fakeThickness, 'moisture': fakeMoisture}, {'tFactor': fakeTFactor, 'mFactor': fakeMFactor}).getInfo();

    expect(res).toStrictEqual({
      period: (fakeMoisture * fakeMFactor + 20).toFixed(2),
      temperature: (fakeThickness * fakeTFactor).toFixed(2),
    });
  });
});

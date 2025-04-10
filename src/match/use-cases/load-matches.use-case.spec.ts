import { LoadMatchesUseCase } from './load-matches.use-case';
import * as fs from 'fs';
import * as path from 'path';

describe('LoadMatchesUseCase', () => {
  let useCase: LoadMatchesUseCase;

  beforeEach(() => {
    useCase = new LoadMatchesUseCase();
  });

  it('parses matches correctly from the log', async () => {
    const log = fs.readFileSync(
      path.resolve(__dirname, '../../../test/fixtures/match1.txt'),
      'utf-8',
    );

    const result = useCase['parseLog'](log);

    expect(result).toEqual([
      {
        id: '11348965',
        startTime: '23/04/2019 15:34:22',
        endTime: '23/04/2019 15:39:22',
        events: [
          {
            timestamp: '23/04/2019 15:36:04',
            killer: 'Roman',
            victim: 'Nick',
            weapon: 'M16',
            isWorldKill: false,
          },
          {
            timestamp: '23/04/2019 15:36:33',
            killer: null,
            victim: 'Nick',
            weapon: null,
            isWorldKill: true,
          },
        ],
      },
      {
        id: '11348966',
        startTime: '23/04/2021 16:14:22',
        endTime: '23/04/2021 16:49:22',
        events: [
          {
            timestamp: '23/04/2021 16:26:04',
            killer: 'Roman',
            victim: 'Marcus',
            weapon: 'M16',
            isWorldKill: false,
          },
          {
            timestamp: '23/04/2021 16:36:33',
            killer: null,
            victim: 'Marcus',
            weapon: null,
            isWorldKill: true,
          },
        ],
      },
      {
        id: '11348961',
        startTime: '24/04/2020 16:14:22',
        endTime: '24/04/2020 20:19:22',
        events: [
          {
            timestamp: '24/04/2020 16:26:12',
            killer: 'Roman',
            victim: 'Marcus',
            weapon: 'M16',
            isWorldKill: false,
          },
          {
            timestamp: '24/04/2020 16:35:56',
            killer: 'Marcus',
            victim: 'Jhon',
            weapon: 'AK47',
            isWorldKill: false,
          },
          {
            timestamp: '24/04/2020 17:12:34',
            killer: 'Roman',
            victim: 'Bryian',
            weapon: 'M16',
            isWorldKill: false,
          },
          {
            timestamp: '24/04/2020 18:26:14',
            killer: 'Bryan',
            victim: 'Marcus',
            weapon: 'AK47',
            isWorldKill: false,
          },
          {
            timestamp: '24/04/2020 19:36:33',
            killer: null,
            victim: 'Marcus',
            weapon: null,
            isWorldKill: true,
          },
        ],
      },
    ]);
  });

  it('handles logs with no matches', async () => {
    const log = `
            23/04/2019 15:34:22 - Random log entry
            23/04/2019 15:36:04 - Another random log entry
        `;

    const result = useCase['parseLog'](log);

    expect(result).toEqual([]);
  });

  it('handles logs with incomplete match data', async () => {
    const log = `
23/04/2019 15:34:22 - New match 11348965 has started
23/04/2019 15:36:04 - Roman killed Nick using M16
        `;

    const result = useCase['parseLog'](log);

    expect(result).toEqual([
      {
        id: '11348965',
        startTime: '23/04/2019 15:34:22',
        endTime: '',
        events: [
          {
            timestamp: '23/04/2019 15:36:04',
            killer: 'Roman',
            victim: 'Nick',
            weapon: 'M16',
            isWorldKill: false,
          },
        ],
      },
    ]);
  });
});

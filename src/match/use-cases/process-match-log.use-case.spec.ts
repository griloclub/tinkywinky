import { Test, TestingModule } from '@nestjs/testing';
import { ProcessMatchLogUseCase } from './process-match-log.use-case';
import { MatchLogParserService } from '../services/match-log-parser.service';
import { MatchRepository } from '../match.repository';
import { PlayerRepository } from '../../player/player.repository';
import { Match } from '../domain/match.entity';
import { Player } from '../../player/domain/player.entity';

describe('ProcessMatchLogUseCase', () => {
  let useCase: ProcessMatchLogUseCase;
  let matchLogParserService: MatchLogParserService;
  let matchRepository: MatchRepository;
  let playerRepository: PlayerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessMatchLogUseCase,
        {
          provide: MatchLogParserService,
          useValue: {
            parse: jest.fn(),
          },
        },
        {
          provide: MatchRepository,
          useValue: {
            saveMatch: jest.fn(),
          },
        },
        {
          provide: PlayerRepository,
          useValue: {
            upsertFromNames: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<ProcessMatchLogUseCase>(ProcessMatchLogUseCase);
    matchLogParserService = module.get<MatchLogParserService>(MatchLogParserService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
    playerRepository = module.get<PlayerRepository>(PlayerRepository);
  });

  it('parses the log and processes matches and players', async () => {
    const log = `
25/04/2020 11:00:45 - New match 1 has started
25/04/2020 11:01:45 - Player1 killed Player2 using Gun
25/04/2020 11:02:50 - Match 1 has ended
    `.trim();

    const mockMatches = [
      {
        computeStats: jest.fn(),
      } as unknown as Match,
    ];
    const mockPlayerNames = new Set(['Player1', 'Player2']);
    const mockPlayers = [{ name: 'Player1' }, { name: 'Player2' }] as Player[];

    jest.spyOn(matchLogParserService, 'parse').mockReturnValue({
      matches: mockMatches,
      playerNames: mockPlayerNames,
    });
    jest.spyOn(playerRepository, 'upsertFromNames').mockResolvedValue(mockPlayers);

    await useCase.execute(log);

    expect(matchLogParserService.parse).toHaveBeenCalledWith(log);
    expect(playerRepository.upsertFromNames).toHaveBeenCalledWith(['Player1', 'Player2']);
    expect(mockMatches[0].computeStats).toHaveBeenCalledWith(mockPlayers);
    expect(matchRepository.saveMatch).toHaveBeenCalledWith(mockMatches[0], mockPlayers);
  });

  it('handles logs with no matches', async () => {
    const log = `
25/04/2020 15:00:45 - Match 1 has ended
    `.trim();

    jest.spyOn(matchLogParserService, 'parse').mockReturnValue({
      matches: [],
      playerNames: new Set(),
    });

    await useCase.execute(log);

    expect(matchLogParserService.parse).toHaveBeenCalledWith(log);
    expect(playerRepository.upsertFromNames).not.toHaveBeenCalled();
    expect(matchRepository.saveMatch).not.toHaveBeenCalled();
  });
});

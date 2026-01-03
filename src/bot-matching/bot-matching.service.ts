import { Injectable } from '@nestjs/common';
import { KnowledgeBaseEntry } from 'src/knowledge-base/entities/knowledge-base.entity';

@Injectable()
export class BotMatchingService {
  normalize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/);
  }

  match(
    message: string,
    entries: KnowledgeBaseEntry[],
  ): KnowledgeBaseEntry | null {
    const words = this.normalize(message);

    let best: KnowledgeBaseEntry | null = null;
    let bestScore = 0;

    for (const entry of entries) {
      const score = entry.keywords.filter(k =>
        words.includes(k.toLowerCase()),
      ).length;

      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    }

    return bestScore > 0 ? best : null;
  }
}


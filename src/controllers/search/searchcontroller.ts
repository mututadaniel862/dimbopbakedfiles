
// ====================================
// SEARCH CONTROLLER (controllers/search/controller.ts)
// ====================================

import { FastifyRequest, FastifyReply } from 'fastify';
import { SearchService } from '../../services/searchservice';

type SearchQuery = {
  q: string; // search query
  page?: string;
  limit?: string;
  type?: 'product' | 'blog';
};

type SuggestionsQuery = {
  q: string;
  limit?: string;
};

export const SearchController = {
  // Global search endpoint
  async globalSearch(
    request: FastifyRequest<{ Querystring: SearchQuery }>,
    reply: FastifyReply
  ) {
    try {
      const { q, page = '1', limit = '20', type } = request.query;

      if (!q || q.trim().length === 0) {
        reply.status(400).send({
          message: 'Search query is required',
          results: [],
          total: 0,
        });
        return;
      }

      if (q.trim().length < 2) {
        reply.status(400).send({
          message: 'Search query must be at least 2 characters long',
          results: [],
          total: 0,
        });
        return;
      }

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      // Validate pagination
      if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
        reply.status(400).send({
          message: 'Invalid pagination parameters',
          results: [],
          total: 0,
        });
        return;
      }

      // Get base URL for frontend links
      const protocol = request.headers['x-forwarded-proto'] || request.protocol;
      const host = request.headers['x-forwarded-host'] || request.headers.host;
      const baseUrl = process.env.FRONTEND_URL || `${protocol}://${host}`;

      const searchResults = await SearchService.globalSearch(
        q.trim(),
        pageNum,
        limitNum,
        type,
        baseUrl
      );

      reply.send({
        ...searchResults,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(searchResults.total / limitNum),
          hasNext: pageNum * limitNum < searchResults.total,
          hasPrev: pageNum > 1,
        },
      });
    } catch (error) {
      request.log.error(`Global search error: ${error}`);
      reply.status(500).send({
        message: 'Internal search error',
        error: (error as Error).message,
        results: [],
        total: 0,
      });
    }
  },

  // Search suggestions endpoint
  async getSearchSuggestions(
    request: FastifyRequest<{ Querystring: SuggestionsQuery }>,
    reply: FastifyReply
  ) {
    try {
      const { q, limit = '5' } = request.query;

      if (!q || q.trim().length === 0) {
        reply.send({ suggestions: [] });
        return;
      }

      const limitNum = parseInt(limit, 10);
      const suggestions = await SearchService.getSearchSuggestions(
        q.trim(),
        Math.min(limitNum, 10) // Max 10 suggestions
      );

      reply.send({ suggestions });
    } catch (error) {
      request.log.error(`Search suggestions error: ${error}`);
      reply.status(500).send({
        message: 'Error fetching suggestions',
        suggestions: [],
      });
    }
  },
};

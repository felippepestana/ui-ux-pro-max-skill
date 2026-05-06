import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { DOCUMENTS, getDocumentById, TEMPLATES } from "@/lib/documents";

export const documentsRouter = router({
  list: protectedProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(({ input }) => {
      // TODO F6.4: ctx.db.document.findMany({ where: { officeId } })
      if (!input?.search) return DOCUMENTS;
      const q = input.search.toLowerCase();
      return DOCUMENTS.filter((d) =>
        `${d.title} ${d.matterCode} ${d.matterClient}`
          .toLowerCase()
          .includes(q),
      );
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const doc = getDocumentById(input.id);
      if (!doc) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Documento não encontrado",
        });
      }
      return doc;
    }),

  templates: protectedProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(({ input }) => {
      if (!input?.search) return TEMPLATES;
      const q = input.search.toLowerCase();
      return TEMPLATES.filter((t) =>
        `${t.title} ${t.area} ${t.description}`.toLowerCase().includes(q),
      );
    }),
});

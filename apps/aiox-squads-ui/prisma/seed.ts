/**
 * Seeds the database with the same demo data the in-repo mocks ship with,
 * so the live backend behaves identically to stub mode after migration.
 *
 *   DATABASE_URL=... npx prisma db seed
 *
 * Re-running is idempotent (uses upsert). Edits to lib/{matters,leads,...}
 * should be reflected here so behaviour stays in sync until the mocks are
 * fully retired in F6.3.
 */

import { PrismaClient } from "@prisma/client";
import { CLIENTS } from "../lib/clients";
import { LEADS } from "../lib/leads";
import { MATTERS } from "../lib/matters";
import { TASKS } from "../lib/tasks";
import { DEADLINES } from "../lib/deadlines";
import { DOCUMENTS, TEMPLATES } from "../lib/documents";
import { FEE_CONTRACTS, INVOICES, PAYMENTS } from "../lib/billing";
import { SQUADS } from "../lib/squads";

const db = new PrismaClient();

const OFFICE_ID = "off-1";

async function main() {
  console.log("→ Seeding office, users, squads…");

  await db.office.upsert({
    where: { id: OFFICE_ID },
    update: {},
    create: { id: OFFICE_ID, name: "Pestana Sociedade Individual de Advocacia", plan: "pro" },
  });

  const users = [
    { id: "u-1", name: "Felippe Pestana", email: "felippe@pestana.adv.br", role: "socio" as const },
    { id: "u-2", name: "Mariana Costa", email: "mariana@pestana.adv.br", role: "advogado" as const },
    { id: "u-3", name: "Lucas Andrade", email: "lucas@pestana.adv.br", role: "advogado" as const },
    { id: "u-4", name: "Beatriz Rocha", email: "beatriz@pestana.adv.br", role: "paralegal" as const },
    { id: "u-5", name: "Carlos Tavares", email: "financeiro@pestana.adv.br", role: "financeiro" as const },
  ];
  for (const u of users) {
    await db.user.upsert({
      where: { id: u.id },
      update: {},
      create: { ...u, officeId: OFFICE_ID },
    });
  }

  for (const s of SQUADS) {
    await db.squad.upsert({
      where: { key: s.key },
      update: {},
      create: {
        id: s.id,
        key: s.key,
        name: s.name,
        tagline: s.tagline,
        description: s.description,
        iconKey: s.iconKey,
        contextTypes: s.contextTypes,
        capabilities: s.agents.flatMap((a) => a.capabilities),
      },
    });
    for (const a of s.agents) {
      await db.agent.upsert({
        where: { key: a.key },
        update: {},
        create: { key: a.key, name: a.name, role: a.role, capabilities: a.capabilities },
      });
    }
  }

  console.log("→ Seeding clients & leads…");

  for (const c of CLIENTS) {
    await db.client.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        officeId: OFFICE_ID,
        kind: c.kind,
        name: c.name,
        taxId: c.taxId,
        email: c.email,
        phone: c.phone,
        address: c.address,
        tags: c.tags,
        conflictStatus: c.conflictStatus,
        notes: c.notes,
        createdAt: new Date(c.createdAt),
      },
    });
  }

  for (const l of LEADS) {
    await db.lead.upsert({
      where: { id: l.id },
      update: {},
      create: {
        id: l.id,
        officeId: OFFICE_ID,
        name: l.name,
        contactEmail: l.contactEmail,
        contactPhone: l.contactPhone,
        source: l.source === "indicação" ? "indicacao" : l.source,
        area: l.area,
        summary: l.summary,
        estimatedValueBrl: l.estimatedValueBrl,
        stage: l.stage,
        expectedCloseAt: l.expectedCloseAt ? new Date(l.expectedCloseAt) : null,
        lostReason: l.lostReason,
        triagedRunId: l.triagedBySquad?.runId,
        createdAt: new Date(l.createdAt),
      },
    });
  }

  console.log("→ Seeding matters, tasks, deadlines, documents…");

  for (const m of MATTERS) {
    await db.matter.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        officeId: OFFICE_ID,
        code: m.code,
        clientId: m.id === "mat-482" ? "cli-001" :
                  m.id === "mat-479" ? "cli-002" :
                  m.id === "mat-471" ? "cli-003" :
                  m.id === "mat-465" ? "cli-004" :
                  m.id === "mat-460" ? "cli-005" :
                  m.id === "mat-454" ? "cli-006" : "cli-007",
        area: m.area,
        type: m.area,
        status: m.status === "audiência" ? "audiencia" : m.status,
        priority: m.priority,
        caseValueBrl: m.caseValueBrl,
        responsibleId: m.responsibleInitials === "FP" ? "u-1" :
                       m.responsibleInitials === "MC" ? "u-2" : "u-3",
        openedAt: new Date(m.openedAt),
      },
    });
  }

  for (const t of TASKS) {
    await db.task.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        matterId: t.matterId,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assigneeId: t.assignee.id,
        dueAt: t.dueAt ? new Date(t.dueAt) : null,
        checklist: t.checklist as unknown as object | undefined,
        dependsOnId: t.dependsOnId,
      },
    });
  }

  for (const d of DEADLINES) {
    await db.deadline.upsert({
      where: { id: d.id },
      update: {},
      create: {
        id: d.id,
        matterId: d.matterId,
        kind: d.kind === "audiência" ? "audiencia" :
              d.kind === "petição" ? "peticao" :
              d.kind === "réplica" ? "replica" :
              d.kind === "tréplica" ? "treplica" :
              d.kind === "manifestação" ? "manifestacao" :
              d.kind === "diligência" ? "diligencia" : d.kind,
        title: d.title,
        court: d.court,
        forensicRule: d.forensicRule,
        dueAt: new Date(d.dueAt),
        status: d.status,
        evidenceUrl: d.evidenceUrl,
        fulfilledAt: d.fulfilledAt ? new Date(d.fulfilledAt) : null,
      },
    });
  }

  for (const tpl of TEMPLATES) {
    await db.documentTemplate.upsert({
      where: { id: tpl.id },
      update: {},
      create: {
        id: tpl.id,
        officeId: OFFICE_ID,
        area: tpl.area,
        kind: tpl.kind,
        title: tpl.title,
        description: tpl.description,
        variables: tpl.variables,
        usageCount: tpl.usageCount,
      },
    });
  }

  for (const doc of DOCUMENTS) {
    await db.document.upsert({
      where: { id: doc.id },
      update: {},
      create: {
        id: doc.id,
        officeId: OFFICE_ID,
        matterId: doc.matterId,
        templateId: doc.templateId,
        kind: doc.kind,
        title: doc.title,
        status: doc.status,
        approvalsRequired: doc.approvalsRequired,
        approvalsObtained: doc.approvalsObtained,
        signers: doc.signers,
        createdAt: new Date(doc.versions[0]!.createdAt),
        updatedAt: new Date(doc.updatedAt),
      },
    });
    for (const v of doc.versions) {
      await db.documentVersion.upsert({
        where: { id: v.id },
        update: {},
        create: {
          id: v.id,
          documentId: doc.id,
          version: v.version,
          authorName: v.authorName,
          sourceRunId: v.sourceRunId,
          excerpt: v.excerpt,
          diffAdded: v.diffSummary?.added,
          diffRemoved: v.diffSummary?.removed,
          createdAt: new Date(v.createdAt),
        },
      });
    }
  }

  console.log("→ Seeding billing (contracts, invoices, payments)…");

  for (const f of FEE_CONTRACTS) {
    await db.feeContract.upsert({
      where: { id: f.id },
      update: {},
      create: {
        id: f.id,
        matterId: f.matterId,
        clientId: f.clientId,
        kind: f.kind,
        description: f.description,
        fixedFeeBrl: f.fixedFeeBrl,
        successFeePercent: f.successFeePercent,
        hourlyRateBrl: f.hourlyRateBrl,
        monthlyRetainerBrl: f.monthlyRetainerBrl,
        signedAt: new Date(f.signedAt),
        status: f.status,
      },
    });
  }

  for (const i of INVOICES) {
    await db.invoice.upsert({
      where: { id: i.id },
      update: {},
      create: {
        id: i.id,
        officeId: OFFICE_ID,
        number: i.number,
        contractId: i.contractId,
        clientId: i.clientId,
        matterId: i.matterCode
          ? MATTERS.find((m) => m.code === i.matterCode)?.id
          : undefined,
        competenceMonth: i.competenceMonth,
        issuedAt: new Date(i.issuedAt),
        dueAt: new Date(i.dueAt),
        totalBrl: i.totalBrl,
        status: i.status,
        lines: {
          create: i.lines.map((l) => ({
            description: l.description,
            qty: l.qty,
            unitBrl: l.unitBrl,
          })),
        },
      },
    });
  }

  for (const p of PAYMENTS) {
    await db.payment.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        invoiceId: p.invoiceId,
        paidAt: new Date(p.paidAt),
        amountBrl: p.amountBrl,
        method: p.method === "Cartão" ? "Cartao" : p.method,
      },
    });
  }

  console.log("✓ Seed concluído.");
}

main()
  .then(() => db.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await db.$disconnect();
    process.exit(1);
  });

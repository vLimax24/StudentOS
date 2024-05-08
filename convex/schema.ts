import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  tasks: defineTable({
    status: v.string(),
    text: v.string(),
    userId: v.id("users"),
    subjectId: v.optional(v.id("subjects")),
  })
    .index("by_subjectId", ["subjectId"])
    .index("by_userId", ["userId"]),
  gradingSystems: defineTable({
    countryName: v.string(),
    countryCode: v.string(),
    system: v.string(),
    possibleGrades: v.array(v.string()),
  }),
  notifications: defineTable({
    recieverUserId: v.id("users"),
    senderUserId: v.optional(v.id("users")),
    documentId: v.optional(v.id("documents")),
    subjectId: v.optional(v.id("subjects")),
    senderImage: v.optional(v.string()),
    text: v.string(),
    date: v.string(),
  }),
  documents: defineTable({
    name: v.string(),
    content: v.optional(v.any()),
    accessType: v.string(),
    allowedUsers: v.optional(v.array(v.id("users"))),
    users: v.optional(v.array(v.id("users"))),
    owner: v.id("users")
  }),
  notes: defineTable({
    showInCalendar: v.boolean(),
    text: v.string(),
    date: v.string(),
    userId: v.id("users"),
    subjectId: v.optional(v.id("subjects")),
  })
    .index("by_subjectId", ["subjectId"])
    .index("by_userId", ["userId"]),
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    username: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    last_seen: v.optional(v.number()),
    clerkId: v.string(),
    country: v.optional(v.id("gradingSystems")),
  }).searchIndex("search_username", {
    searchField: "username",
  }).index("by_clerkId", ["clerkId"]),
  subjects: defineTable({
    name: v.string(),
    color: v.optional(v.string()),
    addedByUser: v.optional(v.boolean()),
  }),
  events: defineTable({
    title: v.string(),
    description: v.string(),
    // subjects: v.optional(v.string()),
    type: v.string(),
    date: v.string(),
    userId: v.id("users"),
    subjectId: v.optional(v.id("subjects")),
  }),
  grades: defineTable({
    userId: v.id("users"),
    subjectId: v.id("subjects"),
    grade: v.string(),
    topic: v.string(),
    date: v.string(),
  })
    .index("by_subjectId", ["subjectId"])
    .index("by_userId", ["userId"]),
  labels: defineTable({
    name: v.string(),
    color: v.string(),
  }).index("by_name", ["name"]),
  // many to many relationship table
  entityLabels: defineTable({
    entityId: v.union(v.id("events"), v.id("notes"), v.id("documents")),
    labelId: v.id("labels"),
  })
    .index("by_entityId", ["entityId"])
    .index("by_labelId", ["labelId"]),
  studentSubjects: defineTable({
    // many to many relationship table
    userId: v.id("users"),
    subjectId: v.id("subjects"),
    totalAverage: v.optional(v.string()),
  })
    .index("by_subjectId", ["subjectId"])
    .index("by_userId", ["userId"]),
})

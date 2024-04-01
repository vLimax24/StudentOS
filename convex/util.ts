import {
    customCtx,
    customQuery
} from "convex-helpers/server/customFunctions";
import { ConvexError } from "convex/values";
import {
    type MutationCtx,
    type QueryCtx,
    query
} from "./_generated/server";
  
export const authQuery = customQuery(
    query,
    customCtx(async (ctx) => {
      try {
        return { user: await getUserOrThrow(ctx) };
      } catch (err) {
        return { user: null };
      }
    })
  );

  async function getUserOrThrow(ctx: QueryCtx | MutationCtx) {
    const userId = (await ctx.auth.getUserIdentity())?.subject;
  
    if (!userId) {
      throw new ConvexError("must be logged in");
    }
  
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field('subject'), userId))
      .first();
  
    if (!user) {
      throw new ConvexError("user not found");
    }
  
    return user;
  }
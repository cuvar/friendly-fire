import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import redis from "~/utils/redis";
import { IUserData } from "~/utils/types";

const REDIS_PRE = "friendly-fire";
const REDIS_USERS = `${REDIS_PRE}-users`;
const REDIS_SPLIT = ",";

export const counterRouter = createTRPCRouter({
  updateCounter: publicProcedure
    .input(z.object({ user: z.string(), newCounter: z.number() }))
    .mutation(async ({ input }) => {
      const key = `${REDIS_PRE}-${input.user}`;
      try {
        const res = await redis.set(key, input.newCounter);
        if (res === "OK") {
          // todo: return is not possible
          // return { success: true };
        }
        // return { success: false };
      } catch (error) {
        // return { success: false };
      }
    }),
  removeUser: publicProcedure
    .input(z.object({ user: z.string() }))
    .mutation(async ({ input }) => {
      const key = `${REDIS_PRE}-${input.user}`;
      try {
        const allUsers = await redis.get(REDIS_USERS);
        if (typeof allUsers != "string") {
          return { success: false };
        }
        const userArray: string[] = allUsers.split(REDIS_SPLIT);
        if (!userArray.includes(input.user)) {
          return { success: false };
        }
        const newAllUsers = userArray.filter((e) => e !== input.user);
        const resSetUsers = await redis.set(
          REDIS_USERS,
          newAllUsers.join(REDIS_SPLIT)
        );
        if (resSetUsers === "OK") {
          const resDel = await redis.del(key);
          if (resDel > 0) {
            // return { success: true };
          }
          // return { success: false };
        }

        // return { success: false };
      } catch (error) {
        // return { success: false };
      }
    }),
  addUser: publicProcedure
    .input(z.object({ user: z.string() }))
    .mutation(async ({ input }) => {
      const key = `${REDIS_PRE}-${input.user}`;
      try {
        const allUsers = await redis.get(REDIS_USERS);
        if (typeof allUsers != "string") {
          return { success: false };
        }
        if (allUsers.split(REDIS_SPLIT).includes(input.user)) {
          return { success: false };
        }

        const newAllUsers = `${allUsers},${input.user}`;
        const res = await redis.set(REDIS_USERS, newAllUsers);

        const resSet = await redis.set(key, 0);
        if (resSet === "OK") {
          // todo: return is not possible
          return { success: true };
        }
        return { success: false };
      } catch (error) {
        return { success: false };
      }
    }),

  getStates: protectedProcedure.query(async () => {
    // await redis.set(REDIS_USERS, "kathi,jakob,jona,luca");
    try {
      const data = await redis.get(REDIS_USERS);
      const users = validateUsers(data);
      if (users.length == 0) {
        return null;
      }

      let userData: IUserData[] = [];
      for (let u of users) {
        const num = await getCounter(u);
        if (num == null) {
          throw new Error("Internal server error while fetching data");
        }

        userData.push({
          user: u,
          counter: num,
        });
      }

      // console.log(userData);

      return userData;
    } catch (error) {
      return null;
    }
  }),
});

function validateUsers(data: unknown): string[] {
  if (typeof data != "string") {
    return [];
  }
  const splitted = data.split(REDIS_SPLIT);
  return splitted;
}

async function getCounter(user: string): Promise<number | null> {
  const key = `${REDIS_PRE}-${user}`;
  try {
    const data = await redis.get(key);
    if (data == null || typeof data !== "number") {
      await redis.set(key, 0);
      return 0;
    }

    return data;
  } catch (error) {
    return null;
  }
}

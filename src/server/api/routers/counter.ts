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

export const counterRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  getStates: protectedProcedure.query(async () => {
    try {
      // const data = await redis.set(REDIS_USERS, "kathi,jakob,luca,jona");
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

      console.log(userData);

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
  const splitted = data.split(",");
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

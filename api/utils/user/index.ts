import prisma from "@property-finder/database";
export const getUserById = async (userId: number) => {
  return await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });
};

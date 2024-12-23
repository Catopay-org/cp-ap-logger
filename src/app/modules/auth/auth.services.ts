import prisma from "@/Config/db";

export const findAuthDataByUid = async (uid: string) => {
    return prisma.auth.findUnique({
        where: {
            uid: uid
        }
    })
}
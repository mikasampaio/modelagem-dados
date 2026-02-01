import app from "@/app";
import { prismaConnect } from "./database/prisma";
import { env } from "./services/config/env";

const port = env.PORT;

const startServer = async () => {
  try {
    await prismaConnect();

    app.listen({ port, host: "0.0.0.0" }, () =>
      console.log(`Server is running on port ${port}`),
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();

// Prisma Schema -> DTO (Schema) -> REPOSITORY (CAMADA PARA CHAMAR O PRISMACLIENT) -> SERVICE -> CONTROLLER -> ROUTES

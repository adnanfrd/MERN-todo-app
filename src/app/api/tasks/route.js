import prisma from '../../../../lib/prisma'; 

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        user: true, 
      },
    });

    return new Response(
      JSON.stringify({ tasks }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { name, email, country, userId } = await req.json(); 

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        name,
        email,
        country,
        user: {
          connect: { id: userId }, 
        },
      },
    });

    return new Response(
      JSON.stringify({ message: 'Task created successfully', task }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

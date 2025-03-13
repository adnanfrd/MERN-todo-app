import prisma from '../../../../lib/prisma'; // 

export async function POST(req) {
  const { email, password } = await req.json(); 

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 400 }
      );
    }

    if (user.password !== password) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Login successful', user }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

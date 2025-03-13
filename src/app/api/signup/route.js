import prisma from '../../../../lib/prisma'; 

export async function POST(req) {
  const { name, email, password } = await req.json();

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, 
      },
    });

    return new Response(
      JSON.stringify({ message: 'User created successfully', user: newUser }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

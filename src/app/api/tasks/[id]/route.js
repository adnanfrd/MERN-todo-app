import prisma from "../../../../../lib/prisma";

export async function PUT(req) {
    const { id, name, email, country, completed } = await req.json();
  
    try {
      const taskExists = await prisma.task.findUnique({ where: { id } });
  
      if (!taskExists) {
        return new Response(
          JSON.stringify({ error: 'Task not found' }),
          { status: 404 }
        );
      }
  
      const updatedTask = await prisma.task.update({
        where: { id },
        data: { name, email, country, completed },
      });
  
      return new Response(
        JSON.stringify({ message: 'Task updated successfully', updatedTask }),
        { status: 200 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
  }

  export async function DELETE(req) {
    const { id } = await req.json();
  
    try {
      const taskExists = await prisma.task.findUnique({ where: { id } });
  
      if (!taskExists) {
        return new Response(
          JSON.stringify({ error: 'Task not found' }),
          { status: 404 }
        );
      }
  
      await prisma.task.delete({ where: { id } });
  
      return new Response(
        JSON.stringify({ message: 'Task deleted successfully' }),
        { status: 200 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
  }
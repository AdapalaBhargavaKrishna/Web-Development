import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { revalidatePath } from 'next/cache'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function Home() {
  const users = await prisma.user.findMany({
    orderBy: {
      id: 'asc'
    }
  })

  async function createUser(formData: FormData) {
    'use server'
    await prisma.user.create({
      data: {
        email: formData.get('email') as string,
        name: formData.get('name') as string,
      }
    })
    revalidatePath('/')
  }

  console.log(users)
  async function updateUser(formData: FormData) {
    'use server'
    const id = Number(formData.get('id'))
    await prisma.user.update({
      where: { id },
      data: {
        email: formData.get('email') as string,
        name: formData.get('name') as string
      }
    })
    revalidatePath('/')
  }

  async function deleteUser(formData: FormData) {
    'use server'
    const id = Number(formData.get('id'))
    await prisma.user.delete({
      where: { id }
    })
    revalidatePath('/')
  }

  return (
    <div className='bg-white min-h-screen p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8 text-black'>User Management - Full CRUD</h1>

        {/* Create Form */}
        <div className='mb-12 p-6 border rounded-lg bg-gray-50'>
          <h2 className='text-xl font-semibold mb-4 text-black'>Create New User</h2>
          <form className='flex gap-4 items-end' action={createUser}>
            <div className='flex-1'>
              <label className='block text-sm text-gray-600 mb-1'>Name</label>
              <input
                className='w-full bg-white p-2 rounded text-black border'
                type="text"
                name="name"
                placeholder="Enter name"
                required
              />
            </div>
            <div className='flex-1'>
              <label className='block text-sm text-gray-600 mb-1'>Email</label>
              <input
                className='w-full bg-white p-2 rounded text-black border'
                type="email"
                name="email"
                placeholder="Enter email"
                required
              />
            </div>
            <button
              className='bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 h-fit'
              type="submit"
            >
              Create
            </button>
          </form>
        </div>

        {/* Users List */}
        <div>
          <h2 className='text-xl font-semibold mb-4 text-black'>Users List</h2>
          <div className='space-y-4'>
            {users.map((user) => (
              <div key={user.id} className='border rounded-lg p-4 bg-white'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <p className='font-medium text-black'>{user.name}</p>
                    <p className='text-gray-600 text-sm'>{user.email}</p>
                  </div>

                  <div className='flex gap-2'>
                    {/* Edit Form - Inline */}
                    <form action={updateUser} className='flex gap-2'>
                      <input type="hidden" name="id" value={user.id} />
                      <input
                        className='bg-blue-50 p-1 rounded text-black border text-sm w-32'
                        type="text"
                        name="name"
                        defaultValue={user.name || ''}
                        placeholder="Name"
                      />
                      <input
                        className='bg-blue-50 p-1 rounded text-black border text-sm w-32'
                        type="email"
                        name="email"
                        defaultValue={user.email}
                        placeholder="Email"
                      />
                      <button
                        className='bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700'
                        type="submit"
                      >
                        Update
                      </button>
                    </form>

                    {/* Delete Form */}
                    <form action={deleteUser}>
                      <input type="hidden" name="id" value={user.id} />
                      <button
                        className='bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700'
                        type="submit"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <p className='text-gray-500 text-center py-8 border rounded-lg bg-gray-50'>
                No users found. Create your first user above!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
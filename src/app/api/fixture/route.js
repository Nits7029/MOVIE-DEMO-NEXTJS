import { NextResponse } from 'next/server'
import connectToDatabase from '@/apollo/server/lib/db'
import models from "@/apollo/server/models";

const initAdmin = async () => {
  let user = await models.User.findOne({ email: "admin@admin.com", isDeleted: false }).lean().exec();
  if (!user) {
    await models.User.create({
      email: "admin@admin.com",
      password: "Abc@1234",
      firstName: 'Admin',
      lastName: ''
    });
  }
}


export async function GET(request) {
  await connectToDatabase()
  await initAdmin()

  return NextResponse.json({ message: 'All Data initiated successfully' })
}
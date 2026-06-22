import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PublicHome from "@/components/PublicHome";
import { auth } from "@/auth"
import PartnerDashboard from "@/components/PartnerDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import connectDB from "@/lib/db"
import userModel from "@/models/UserModel"
import GeoUpdated from "@/components/GeoUpdated";

export default async function Home() {
  const session = await auth()

  await connectDB()
  const user = await userModel.findOne({ email: session?.user?.email })

  return (
    <div className="w-full min-h-screen bg-white">
      <GeoUpdated userId={user?._id.toString()} />
      {user?.role === "partner" ? <> <Nav /><PartnerDashboard /></> : (user?.role === "admin" ? <AdminDashboard /> : <> <Nav /><PublicHome /> </>)}
      <Footer />
    </div>
  );
}

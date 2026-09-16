import Link from "next/link";
import Image from "next/image";
import StatCard from "@/components/ui/StatCard";
import { getAppointmentList } from "@/lib/actions/appointment.actions";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/columns";

async function Admin() {
  const appointmentsList = await getAppointmentList();
  return (
    <div className="flex  w-full flex-col space-y-14 h-screen bg-dark-300">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            width={32}
            height={32}
            alt="Logo"
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">Admin Dashboard</p>
      </header>
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome</h1>
          <p className="text-dark-700">
            Start the day with managing new appointment
          </p>
        </section>
        <section className="admin-stat">
          <StatCard
            type="scheduled"
            count={appointmentsList.shceduledCount}
            label="Scheduled"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointmentsList.pendingCount}
            label="Pending"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointmentsList.cancelledCount}
            label="Cancelled"
            icon="/assets/icons/cancelled.svg"
          />
        </section>
        <DataTable data={appointmentsList.rows} columns={columns} />
      </main>
    </div>
  );
}

export default Admin;

import AbsenceChartPage from "@/components/ChartAreaInteractive";

import { SectionCards } from "@/components/SectionCards";


export default async function AdminUsersPage() {

   return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

          <SectionCards />
          <div className="px-4 lg:px-6">
            <AbsenceChartPage />
          </div>
        </div>
      </div>
    </div>
  );
}

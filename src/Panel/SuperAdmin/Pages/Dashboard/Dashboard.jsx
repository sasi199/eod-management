import React, { useEffect, useState } from "react";
import icon1 from "../../../../assets/SuperAdmin/female.png";
import teacher from "../../../../assets/SuperAdmin/icon1.jpeg";
import student from "../../../../assets/SuperAdmin/students.png";
import CountUp from "react-countup";

const Dashboard = () => {
  const [adminCount, setAdminCount] = useState(0);
  const [hrCount, setHrCount] = useState(0);
  const [trainerCount, setTrainerCount] = useState(0);
  const [traineeCount, setTraineeCount] = useState(0);

  useEffect(() => {
    setAdminCount(5);
    setHrCount(10);
    setTrainerCount(20);
    setTraineeCount(50);
  }, []);

  return (
    <div className="p-4">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex gap-36 items-center  bg-white border border-orange-500  p-2 rounded-md shadow-lg text-center">
          <img src={teacher} className="w-14 h-14" alt="" />

          <div>
            <h2 className="text-xl font-semibold">Admins</h2>
            <p className="text-3xl text-orange-600 font-medium">
              <CountUp end={adminCount} duration={2} />
            </p>
          </div>
        </div>

        <div className="flex  items-center bg-white border border-orange-500  p-6  gap-36 rounded-md shadow-lg text-center">
          <img src={teacher} className="w-14 h-14" alt="" />
          <div>
            <h2 className="text-xl font-semibold">HR</h2>
            <p className="text-3xl text-orange-600 font-medium">
              <CountUp end={hrCount} duration={2} />
            </p>
          </div>
        </div>

        <div className="flex  items-center gap-24 bg-white border border-orange-500  p-6 rounded-md shadow-lg text-center">
          <img src={icon1} className="w-20 h-20" alt="" />

          <div>
            <p className="text-3xl text-orange-600 font-medium">
              <CountUp end={trainerCount} duration={2} />
            </p>
            <h2 className="text-xl font-semibold">Trainers</h2>
          </div>
        </div>

        <div className="flex items-center bg-white border border-orange-500 gap-24 p-6 rounded-md shadow-lg text-center">
       <img src={student} className="w-20 h-20" alt="" />
       <div>
          <h2 className="text-xl font-semibold">Trainees</h2>
          <p className="text-3xl text-orange-600 font-medium">
            <CountUp end={traineeCount} duration={2} />
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

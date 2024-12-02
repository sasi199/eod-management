import React, { useEffect, useState } from 'react';
import { GetAssessment } from '../../../../services';

const TraineeAssessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await GetAssessment();

        if (res?.data?.data) {
          setAssessments(res.data.data);
          console.log(res.data.data);
        } else {
          console.error("Unexpected response format:", res.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading assessments...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">Trainee Assessments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.length === 0 ? (
          <div className="col-span-full text-center text-lg font-medium">
            No assessments available.
          </div>
        ) : (
          assessments.map((assessment) => (
            <div
              key={assessment._id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Assessment Title */}
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{assessment.assessmentTitle}</h2>

              {/* Subject and Timing */}
              <p className="text-gray-700 text-md mb-2">
                <strong>Subject:</strong> {assessment.subject}
              </p>
              <p className="text-gray-700 text-md mb-4">
                <strong>Time:</strong> {assessment.assessmentTiming}
              </p>

              {/* Media URL (Link to PDF or other media) */}
              <div className="mb-4">
                <a
                  href={assessment.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  View Assessment Details (PDF)
                </a>
              </div>

              {/* Completed and Attended Members */}
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {assessment.completedMembers.length} / {assessment.attendedMembers.length} Completed
                </p>
                <a
                  href={assessment.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-500 text-white py-1 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  View Details
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TraineeAssessment;

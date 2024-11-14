import React, { useState } from 'react';
import { Button, Modal, List } from 'antd';
import { FilePdfOutlined, LinkOutlined } from '@ant-design/icons';

const TraineeAssessment = () => {
  const [assessments, setAssessments] = useState([
    {
      id: 1,
      title: 'JavaScript Basics',
      description: 'Learn the basics of JavaScript, including variables, functions, and loops.',
      dueDate: '2024-11-20',
      status: 'Not Attempted',
      attachment: { type: 'link', url: 'https://example.com/js-basics' }, // Link example
    },
    {
      id: 2,
      title: 'React Components',
      description: 'Understand React components, props, and state management.',
      dueDate: '2024-11-22',
      status: 'Not Attempted',
      attachment: { type: 'pdf', url: '/files/react-components.pdf' }, // PDF example
    },
  ]);

  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAssessment(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Trainee Assessment Panel</h2>

      <List
        itemLayout="horizontal"
        dataSource={assessments}
        renderItem={(assessment) => (
          <List.Item
            actions={[
              <Button type="primary" onClick={() => openAssessment(assessment)}>
                View
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={<span className="font-semibold">{assessment.title}</span>}
              description={`${assessment.description} (Due: ${assessment.dueDate})`}
            />
            <span>Status: {assessment.status}</span>
          </List.Item>
        )}
      />

      {selectedAssessment && (
        <Modal
          title={`Assessment: ${selectedAssessment.title}`}
          open={isModalOpen}
          onCancel={closeModal}
          footer={null}
        >
          <p>
            <strong>Description:</strong> {selectedAssessment.description}
          </p>
          <p>
            <strong>Due Date:</strong> {selectedAssessment.dueDate}
          </p>

          <div className="mt-4">
            <strong>Attachment:</strong>{' '}
            {selectedAssessment.attachment.type === 'link' ? (
              <a href={selectedAssessment.attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                <LinkOutlined /> View Link
              </a>
            ) : (
              <a href={selectedAssessment.attachment.url} target="_blank" rel="noopener noreferrer" className="text-red-500">
                <FilePdfOutlined /> Download PDF
              </a>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TraineeAssessment;

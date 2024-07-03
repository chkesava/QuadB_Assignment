// TaskList.js
import React from 'react';
import { Container, Text, Title, ActionIcon, Card, Group, Checkbox } from '@mantine/core';
import { Trash, Edit } from 'tabler-icons-react';
import './style.css'


const TaskList = ({ tasks, deleteTask, toggleComplete, editTask }) => {
  return (
    <Container size={550} my={40} className='main-con'>
      <Group position="apart">
        <Title 
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
        
          })}
        >
          My Tasks
        </Title>
        {}
      </Group>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <Card
              withBorder
              key={index}
              mt="sm"
              style={{
                width: '100%',
                maxWidth: 'calc(50% - 10px)',
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              <Group position="apart">
                <Text weight="bold">{task.title}</Text>
                <Group>
                  <ActionIcon
                    onClick={() => editTask(task, index)}
                    color="blue"
                    variant="transparent"
                  >
                    <Edit />
                  </ActionIcon>
                  <ActionIcon onClick={() => deleteTask(index)} color="red" variant="transparent">
                    <Trash />
                  </ActionIcon>
                </Group>
              </Group>
              <Text color="dimmed" size="md" mt="sm">
                {task.summary ? task.summary : 'No summary was provided for this task'}
              </Text>
              <Checkbox
                label="Completed"
                checked={task.completed}
                onChange={() => toggleComplete(index)}
              />
              {
                <p>tag : {task.tag}</p>
              }
            </Card>
          ))
        ) : (
          <Text size="lg" mt="md" className='title'>
            You have no tasks
          </Text>
        )}
      </div>
    </Container>
  );
};

export default TaskList;

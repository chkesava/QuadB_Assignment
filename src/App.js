import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import {
  Button,
  Modal,
  TextInput,
  Group,
  Select,
  ActionIcon,
} from '@mantine/core';
import { MoonStars, Sun, } from 'tabler-icons-react';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import TaskList from './TaskList';


const tagOptions = [
  { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'sports', label: 'Sports' },
  { value: 'travel', label: 'Travel' },
  { value: 'others', label: 'Others' },
];

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTag, setSelectedTag] = useState('');

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  const taskTitle = useRef('');
  const taskSummary = useRef('');

  function createTask() {
    const newTasks = [
      ...tasks,
      {
        title: taskTitle.current.value,
        summary: taskSummary.current.value,
        completed: false,
        tag: selectedTag,
      },
    ];
    setTasks(newTasks);
    saveTasks(newTasks);
    taskTitle.current.value = '';
    taskSummary.current.value = '';
    setSelectedTag('');
    setOpened(false);
  }

  function updateTask() {
    const updatedTasks = tasks.map((task, index) => {
      if (index === editingTask.index) {
        return {
          ...task,
          title: taskTitle.current.value,
          summary: taskSummary.current.value,
          tag: selectedTag,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setEditingTask(null);
    taskTitle.current.value = '';
    taskSummary.current.value = '';
    setSelectedTag('');
    setOpened(false);
  }

  function deleteTask(index) {
    const clonedTasks = [...tasks];
    clonedTasks.splice(index, 1);
    setTasks(clonedTasks);
    saveTasks(clonedTasks);
  }

  function toggleComplete(index) {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function loadTasks() {
    const loadedTasks = localStorage.getItem('tasks');
    const tasks = JSON.parse(loadedTasks);
    if (tasks) {
      setTasks(tasks);
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme, defaultRadius: 'md' }} withGlobalStyles withNormalizeCSS>
        <BrowserRouter>
		  <div style={{ display:'flex',marginTop:'30px',justifyContent:'end', margin:'30px' }}>
		  <ActionIcon
              variant="outline"
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {colorScheme === 'dark' ? <Sun size={50} /> : <MoonStars size={25} />}
            </ActionIcon>
          </div>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <TaskList
                    tasks={tasks}
                    deleteTask={deleteTask}
                    toggleComplete={toggleComplete}
                    editTask={(task, index) => {
                      setEditingTask({ task, index });
                      setOpened(true);
                      setSelectedTag(task.tag || '');
                    }}
                  />
                  <Button
                    onClick={() => {
                      setOpened(true);
                    }}
                    fullWidth
                    mt="md"
                    style={{ 
                      display: 'block', 
                      margin: '0 auto', 
                      width: '200px' // adjust the width as needed 
                    }}
                  >
                    New Task
                  </Button>
                </div>
              }
            />
            <Route path="/tasks/:taskId" element={<div>Task Details Placeholder</div>} />
          </Routes>
          <Modal
            opened={opened}
            size="md"
            title={editingTask ? 'Edit Task' : 'New Task'}
            withCloseButton={false}
            onClose={() => {
              setOpened(false);
              setEditingTask(null);
            }}
            centered
          >
            <TextInput
              mt="md"
              ref={taskTitle}
              placeholder="Task Title"
              required
              label="Title"
              defaultValue={editingTask ? editingTask.task.title : ''}
            />
            <TextInput
              ref={taskSummary}
              mt="md"
              placeholder="Task Summary"
              label="Summary"
              defaultValue={editingTask ? editingTask.task.summary : ''}
            />
            <Select
              mt="md"
              data={tagOptions}
              value={selectedTag}
              onChange={(value) => setSelectedTag(value)}
              placeholder="Select Tag"
            />
            <Group mt="md" position="apart">
              <Button onClick={() => { setOpened(false); setEditingTask(null); }} variant="subtle">
                Cancel
              </Button>
              <Button onClick={() => { editingTask ? updateTask() : createTask(); }}>
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </Group>
          </Modal>
        </BrowserRouter>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {_id: "uXdKnQpnkcbeGhd6bcMe3MFy" 
    // 'RwvZNfRY3HthTWSual7hLQDK'
    , projects : []},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    _id: (state, action) => {
      state.value.id=action.payload;
    },
    addProject : (state, action) => {
      state.value.projects.push(action.payload.project)
    },
    modifyProject: (state, action) => {
      const { projectId, newProjectData } = action.payload;
      const projectIndex = state.value.projects.findIndex(project => project._id === projectId);
    
      if (projectIndex !== -1) {
        // Remplace toutes les propriétés du projet par les nouvelles données
        state.value.projects[projectIndex] = { ...state.value.projects[projectIndex], ...newProjectData };
      } else {
        console.error(`Le projet avec l'ID ${projectId} n'a pas été trouvé.`);
      }
    },
    deleteProject: (state, action) => {
      const projectId = action.payload;

      // Filtrer les projets pour exclure celui avec l'ID à supprimer
      state.value.projects = state.value.projects.filter(project => project._id !== projectId);
    },
  },
});

export const { _id } = userSlice.actions;
export default userSlice.reducer;

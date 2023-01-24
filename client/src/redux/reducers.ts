import { combineReducers, AnyAction } from 'redux';

const SelectedBirdOnExplore = (state = null, action: AnyAction) => {
  //when a bird is selected on the explore page, the state is changed
  if (action.type === 'UPDATE_EXPLORE_BIRD') {
    return { ...action.bird };
  }
  return state;
};

const userInfo = (state = null, action: AnyAction) => {
  if (action.type === 'UPDATE_USER_INFO') {
    return { ...action.user };
  }
  return state;
};

const reducers = combineReducers({
  SelectedBirdOnExplore,
  userInfo,
});

export default reducers;

// @flow
import { connect } from "react-redux";
import actions from "../store/actions";
// import FollowersSuggestionBox from "../components/FollowersSuggestionBox";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onMount: () => {
      dispatch(actions.getUsersAction());
    },
    onRefreshClick: () => {
      dispatch();
    },
    onCloseItem: () => {
      dispatch();
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
//   FollowersSuggestionBox
);

import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import { ScriptEditor } from './script_editor'

import Formsy from 'formsy-react'
import { FormsyText, FormsySelect } from 'formsy-material-ui/lib'
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

import ContentClear from 'material-ui/svg-icons/content/clear'
import Dialog from 'material-ui/Dialog'
import { InteractionSteps } from '../../api/interaction_steps/interaction_steps'
import { getAllParents, InteractionStepCollection } from '../local_collections/interaction_steps'
import { allScriptFields } from '../../api/scripts/scripts'
import { muiTheme } from '../../ui/theme'
import { grey400, grey100 } from 'material-ui/styles/colors'
import { Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator } from 'material-ui/Toolbar'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import ForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'
import EditIcon from 'material-ui/svg-icons/image/edit'
import Divider from 'material-ui/Divider'
import Subheader from 'material-ui/Subheader'
import SelectField from 'material-ui/SelectField'
const QuestionLink = ({ text, interactionStep, onClickStepLink }) => (
  <FlatButton
    label={interactionStep.question ? `Next step: ${interactionStep.question}` : 'Next Step'}
    secondary
    onTouchTap={() => onClickStepLink(interactionStep._id)}
    icon={<ForwardIcon />}
  />
)
const styles = {
  radioButtonIcon: {
    height: '14px',
    verticalAlign: 'middle'
  },
  answer: {
    fontSize: '12'
  },
  answerRow: {
    marginTop: 16,
    marginBottom: 16
  },
}

export class CampaignQuestionFormAnswerRow extends Component {
  constructor(props) {
    super(props)
    this.handleUpdateAnswer = this.handleUpdateAnswer.bind(this)
    this.handleDeleteAnswer = this.handleDeleteAnswer.bind(this)
    this.focus = () => this.refs.input.focus()

  }
  handleAnswerInputOnKeyDown(answer, event) {
    const { onAddAnswer, onDeleteAnswer } = this.props
    if (event.keyCode === 13) {
      onAddAnswer()
    } else if (event.keyCode === 8 && event.target.value === '') {
      onDeleteAnswer(answer)
    }
  }

  handleUpdateAnswer(answerId, updates) {
    const { interactionStep, onEditQuestion } = this.props
    //FIXME inefficintes
    const allowedAnswers = interactionStep.allowedAnswers.map((allowedAnswer) => {
      if (allowedAnswer._id === answerId) {
        return _.extend(allowedAnswer, updates)
      }
      return allowedAnswer
    })
    onEditQuestion(interactionStep._id, { allowedAnswers })
  }

  handleDeleteAnswer(answer) {
    const { interactionStep, onEditQuestion } = this.props
    const allowedAnswers = _.reject(interactionStep.allowedAnswers, (allowedAnswer) => allowedAnswer._id === answer._id)
    onEditQuestion(interactionStep._id, { allowedAnswers })
  }

  render() {
    const { otherQuestions, interactionStep, answer, autoFocus, index, campaignStarted, onAddQuestion, onClickStepLink } = this.props

    const deleteAnswerButton = (
      <IconButton
        style={{width: 42, height: 42, verticalAlign: 'middle'}}
        iconStyle={{width: 20, height: 20}}
        onTouchTap={() => this.handleDeleteAnswer(answer)}
      >
        <ContentClear />
      </IconButton>
    )

    const addNextQuestionButton = (
      <RaisedButton
        label="Go to new step"
        onTouchTap={() => onAddQuestion({parentStepId: interactionStep._id, parentAnswerId: answer._id })}
      />
    )

    return (
        <div style={styles.answerRow} className="row">
          <div className="col-xs">
            <RadioButtonUnchecked
              style={styles.radioButtonIcon}
            />

            <FormsyText
              ref="input"
              onKeyDown={ (event) => this.handleAnswerInputOnKeyDown(answer, event) }
              onFocus={(event) => event.target.select()}
              onChange={ (event) => this.handleUpdateAnswer(answer._id, { value: event.target.value })}
              inputStyle={styles.answer}
              autoFocus={autoFocus}
              hintStyle={styles.answer}
              required
              disabled={campaignStarted}
              name={`allowedAnswers[${index}].value`}
              hintText='Answer'
              value={ answer.value }
            />
            { campaignStarted ? '' : deleteAnswerButton}
          </div>
          <div className="col-xs">

          { answer.interactionStepId ? (
            <QuestionLink
              interactionStep={InteractionStepCollection.findOne(answer.interactionStepId)}
              text="Linked"
              onClickStepLink={onClickStepLink}
            />
            ): addNextQuestionButton }
          </div>
      </div>
    )

  }

}
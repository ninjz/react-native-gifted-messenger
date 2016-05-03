import React, { View, Text, StyleSheet, TouchableHighlight, Dimensions, Image, Component } from 'react-native';
import moment from 'moment';
import Bubble from './Bubble';
import ErrorButton from './ErrorButton';

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  name: {
    color: '#00467E',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 5,
  },
  messageText: {
    marginLeft: 5,
  },
  nameInsideBubble: {
    color: '#666666',
    marginLeft: 0,
  },
  imagePosition: {
    height: 45,
    width: 45,
    alignSelf: 'flex-end',
    marginLeft: 8,
    marginRight: 8,
  },
  image: {
    alignSelf: 'center',
    borderRadius: 25,
  },
  imageLeft: {
  },
  imageRight: {
  },
  spacer: {
    width: 10,
  },
  date: {
    color: '#aaaaaa',
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  status: {
    color: '#aaaaaa',
    fontSize: 12,
    textAlign: 'right',
    marginRight: 15,
    marginBottom: 10,
    marginTop: -5,
  },
});

export default class Message extends Component {

  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }

  renderName(name, displayNames, diffMessage){
    if (displayNames === true) {
      return (
        <Text
          style={[
            styles.name,
            this.props.displayNamesInsideBubble ? styles.nameInsideBubble : null,
          ]}
        >
          {name}
        </Text>
      );
    }
    return null;
  }

  renderImage(rowData, diffMessage, forceRenderImage, onImagePress) {
    const ImageView = rowData.imageView || Image;
    if (rowData.image) {
      if (forceRenderImage) {
        diffMessage = null; // force rendering
      }

      if (diffMessage === null || (diffMessage !== null && (rowData.name !== diffMessage.name || rowData.uniqueId !== diffMessage.uniqueId))) {
        if (typeof onImagePress === 'function') {
          return (
            <TouchableHighlight
              underlayColor='transparent'
              onPress={() => onImagePress(rowData)}
            >
              <ImageView
                source={rowData.image}
                style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}
              />
            </TouchableHighlight>
          );
        }
        return (
          <ImageView
            source={rowData.image}
            style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}
          />
        );
      }
      return (
        <View style={styles.imagePosition} />
      );
    }
    return (
      <View style={styles.spacer} />
    );
  }

  renderErrorButton(rowData, onErrorButtonPress) {
    if (rowData.status === 'ErrorButton') {
      return (
        <ErrorButton
          onErrorButtonPress={onErrorButtonPress}
          rowData={rowData}
          styles={styles}
        />
      );
    }
    return null;
  }

  renderStatus(status) {
    if (status !== 'ErrorButton' && typeof status === 'string') {
      if (status.length > 0) {
        return (
          <View>
            <Text style={styles.status}>{status}</Text>
          </View>
        );
      }
    }
    return null;
  }

  renderDate(rowData = {}) {
    if (rowData.date instanceof Date) {
      return (
        <Text style={[styles.date]}>
          {moment(rowData.date).calendar()}
        </Text>
      );
    }
    return null;
  }


  render() {
    var {
      rowData,
      onErrorButtonPress,
      position,
      displayNames,
      diffMessage,
      forceRenderImage,
      onImagePress,
      onMessageLongPress,
    } = this.props;

    const flexStyle = {};
    let RowView = Bubble;
    if (rowData.text) {
      if (rowData.text.length > 40) {
        flexStyle.flex = 1;
      }
    }

    if (rowData.view) {
      RowView = rowData.view;
    }

    let messageView2 = (
      <View>
        {position === 'left' && !this.props.displayNamesInsideBubble ? this.renderName(rowData.name, displayNames, diffMessage) : null}
        <View
          style={[styles.rowContainer, {
            justifyContent: position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center',
          }]}
        >
          {position === 'left' ? this.renderImage(rowData, diffMessage, forceRenderImage, onImagePress) : null}
          {position === 'right' ? this.renderErrorButton(rowData, onErrorButtonPress) : null}
          <RowView
            {...rowData}
            renderCustomText={this.props.renderCustomText}
            styles={styles}
            name={position === 'left' && this.props.displayNamesInsideBubble ? this.renderName(rowData.name, displayNames, diffMessage) : null}

            parseText={this.props.parseText}
            handlePhonePress={this.props.handlePhonePress}
            handleUrlPress={this.props.handleUrlPress}
            handleEmailPress={this.props.handleEmailPress}
          />
          {rowData.position === 'right' ? this.renderImage(rowData, diffMessage, forceRenderImage, onImagePress) : null}
        </View>
        {rowData.position === 'right' ? this.renderStatus(rowData.status) : null}
      </View>
    );

    let messageView = (
      <View>
        <View style={[styles.rowContainer, {
            flexDirection: 'row'
          }]}>
          {this.renderImage(rowData, diffMessage, forceRenderImage, onImagePress)}
          <View>
            {this.renderName(rowData.name, displayNames, diffMessage)}
            <Text style={[styles.messageText, {
                justifyContent: 'center'
              }]}>
              {rowData.text}
            </Text>
          </View>

          <View style={{
              flex: 1,
              alignSelf: 'flex-start',
              alignItems: 'flex-end',
              paddingRight: 5,
            }}>
            {this.renderDate(rowData)}
          </View>
        </View>
        <View style={{
            height: 1,
            marginLeft: 50,
            backgroundColor: '#F6F6F6',
            width: Dimensions.get('window').width
          }}>
        </View>
      </View>
    )

    if (typeof onMessageLongPress === 'function') {
      return (
        <TouchableHighlight
          underlayColor="transparent"
          onLongPress={() => onMessageLongPress(rowData)}
        >
          {messageView}
        </TouchableHighlight>
      );
    }
    return messageView;
  }
}

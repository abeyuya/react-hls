'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('!script-loader!hls.js');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcSlider = require('rc-slider');

var _rcSlider2 = _interopRequireDefault(_rcSlider);

var _screenfull = require('screenfull');

var _screenfull2 = _interopRequireDefault(_screenfull);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

require('rc-slider/assets/index.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HLSPlayer = function (_Component) {
  _inherits(HLSPlayer, _Component);

  function HLSPlayer(props, context) {
    _classCallCheck(this, HLSPlayer);

    var _this = _possibleConstructorReturn(this, (HLSPlayer.__proto__ || Object.getPrototypeOf(HLSPlayer)).call(this, props, context));

    _this.state = {
      isPlaying: _this.props.autoPlay,
      isMuted: _this.props.autoMute,
      showPlaybackMenu: false,
      showPreloader: false,
      isFullscreen: false,
      activeRate: 6,
      currentTime: '00:00',
      duration: '00:00'
    };


    _this.player = null;

    _this.handlePlayBtn = _this.handlePlayBtn.bind(_this);
    _this.handleFullScreenBtn = _this.handleFullScreenBtn.bind(_this);
    _this.handleVolumeBtn = _this.handleVolumeBtn.bind(_this);
    _this.handleVolumeChange = _this.handleVolumeChange.bind(_this);
    _this.handleDurationChange = _this.handleDurationChange.bind(_this);
    _this.handlePlayBackBtn = _this.handlePlayBackBtn.bind(_this);
    _this.handleVideoListeners = _this.handleVideoListeners.bind(_this);

    // HLS event callbacks
    _this.onMediaAttached = _this.onMediaAttached.bind(_this);
    _this.onManifestParsed = _this.onManifestParsed.bind(_this);
    _this.onHlsError = _this.onHlsError.bind(_this);
    _this.onFragParsingMetadata = _this.onFragParsingMetadata.bind(_this);
    _this.onFragChanged = _this.onFragChanged.bind(_this);
    return _this;
  }

  _createClass(HLSPlayer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var hlsParams = this.props.hlsParams;

      var mobile = this.whatMobile();

      if (mobile === 'iPad' || mobile === 'iPhone') this.videoElement.src = this.props.source;

      if (!Hls.isSupported()) return;

      this.player = new Hls(hlsParams);

      this.player.attachMedia(this.videoElement);

      this.player.on(Hls.Events.MEDIA_ATTACHED, this.onMediaAttached);
      this.player.on(Hls.Events.MANIFEST_PARSED, this.onManifestParsed);
      this.player.on(Hls.Events.ERROR, this.onHlsError);
      this.player.on(Hls.Events.FRAG_PARSING_METADATA, this.onFragParsingMetadata);
      this.player.on(Hls.Events.FRAG_CHANGED, this.onFragChanged);

      window.addEventListener('click', this.hidePlayBackMenu.bind(this));
      window.addEventListener('resize', this.hidePlayBackMenu.bind(this));
      document.addEventListener(_screenfull2.default.raw.fullscreenchange, this.handleScreenfullChange.bind(this));
    }
  }, {
    key: 'whatMobile',
    value: function whatMobile() {
      return new _mobileDetect2.default(window.navigator.userAgent).mobile();
    }
  }, {
    key: 'isMobile',
    value: function isMobile() {
      return !!new _mobileDetect2.default(window.navigator.userAgent).mobile();
    }
  }, {
    key: 'handleScreenfullChange',
    value: function handleScreenfullChange() {
      this.setState({ isFullscreen: _screenfull2.default.isFullscreen });
    }
  }, {
    key: 'handleVideoListeners',
    value: function handleVideoListeners() {
      var _this2 = this;

      var disableControls = this.props.disableControls;


      this.videoElement.addEventListener('timeupdate', function () {
        if (!disableControls) {
          _this2.durationBar.setState({
            value: 100 / _this2.videoElement.duration * _this2.videoElement.currentTime
          });
          _this2.setState({
            currentTime: formatTime(_this2.videoElement.currentTime, _this2._hasHours())
          });
        }
      });

      this.videoElement.addEventListener('canplay', function () {
        if (!disableControls) _this2.setState({
          duration: formatTime(_this2.videoElement.duration, _this2._hasHours()),
          currentTime: formatTime(0, _this2._hasHours())
        });
      });

      this.videoElement.addEventListener('ended', function () {
        _this2.videoElement.pause();
      });

      this.videoElement.addEventListener('waiting', function () {
        if (!disableControls) _this2.setState({ showPreloader: true });
      });

      this.videoElement.addEventListener('canplaythrough', function () {
        if (!disableControls) _this2.setState({ showPreloader: false });
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('click', this.hidePlayBackMenu.bind(this));
      window.removeEventListener('resize', this.hidePlayBackMenu.bind(this));
    }
  }, {
    key: 'onMediaAttached',
    value: function onMediaAttached() {
      this.player.loadSource(this.props.source);
      this.props.hlsEvents.onMediaAttached();
    }
  }, {
    key: 'onManifestParsed',
    value: function onManifestParsed() {
      var _state = this.state,
          isPlaying = _state.isPlaying,
          isMuted = _state.isMuted;


      this.player.startLoad();

      if (isPlaying) this.videoElement.play();

      if (isMuted) {
        this.videoElement.muted = true;
        if (!disableControls) this.volumeBar.setState({ value: 0 });
      }

      this.handleVideoListeners();

      this.props.hlsEvents.onManifestParsed();
    }
  }, {
    key: 'onHlsError',
    value: function onHlsError(err) {
      console.log('error with HLS...');
      this.props.hlsEvents.onError(err);
    }
  }, {
    key: 'onFragParsingMetadata',
    value: function onFragParsingMetadata(e, data) {
      console.log('on fragment parsing metadata...');
      this.props.hlsEvents.onFragParsingMetadata(e, data);
    }
  }, {
    key: 'onFragChanged',
    value: function onFragChanged(e, data) {
      console.log('on fragment changed...');
      this.props.hlsEvents.onFragChanged(e, data);
    }
  }, {
    key: '_hasHours',
    value: function _hasHours() {
      return this.videoElement.duration / 3600 >= 1.0;
    }
  }, {
    key: 'rawHTML',
    value: function rawHTML(html) {
      return { __html: html };
    }
  }, {
    key: 'hidePlayBackMenu',
    value: function hidePlayBackMenu() {
      if (this.state.showPlaybackMenu) this.setState({ showPlaybackMenu: false });
    }
  }, {
    key: 'handlePlayBtn',
    value: function handlePlayBtn(e) {
      var mobile = this.whatMobile();

      if (mobile === 'iPad' || mobile === 'iPhone') this.videoElement.play();

      if (this.props.disableControls) return;

      e.stopPropagation();

      var isPlaying = this.state.isPlaying;


      if (isPlaying) this.videoElement.pause();else this.videoElement.play();

      this.setState({ isPlaying: !isPlaying });
    }
  }, {
    key: 'handleFullScreenBtn',
    value: function handleFullScreenBtn() {
      if (_screenfull2.default.enabled) _screenfull2.default.toggle(this.videoContainer);
    }
  }, {
    key: 'handleVolumeBtn',
    value: function handleVolumeBtn() {
      var isMuted = this.state.isMuted;


      this.videoElement.muted = !isMuted;

      if (this.volumeBar) this.volumeBar.setState({ value: isMuted ? 1 : 0 });

      this.setState({ isMuted: !isMuted });
    }
  }, {
    key: 'handleVolumeChange',
    value: function handleVolumeChange() {
      var volume = this.volumeBar.state.value;
      var isMuted = parseFloat(volume) <= 0;

      this.videoElement.volume = volume;
      this.videoElement.muted = isMuted;

      this.setState({ isMuted: isMuted });
    }
  }, {
    key: 'handleDurationChange',
    value: function handleDurationChange() {
      this.videoElement.currentTime = this.videoElement.duration * (this.durationBar.state.value / 100);
    }
  }, {
    key: 'handlePlayBackBtn',
    value: function handlePlayBackBtn(e) {
      e.stopPropagation();

      var showPlaybackMenu = this.state.showPlaybackMenu;


      this.setState({ showPlaybackMenu: !showPlaybackMenu });

      this.playbackMenu.style.display = !showPlaybackMenu ? 'flex' : 'none';
      this.playbackMenu.style.top = -this.playbackMenu.clientHeight + 'px';
      this.playbackMenu.style.left = this.playbackBtn.offsetLeft - 10 + 'px';
    }
  }, {
    key: 'handlePlayBackRateChange',
    value: function handlePlayBackRateChange(e, rate) {
      e.stopPropagation();

      this.setState({
        activeRate: rate.id,
        showPlaybackMenu: false
      });

      this.videoElement.playbackRate = rate.value;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _state2 = this.state,
          isPlaying = _state2.isPlaying,
          isMuted = _state2.isMuted,
          currentTime = _state2.currentTime,
          duration = _state2.duration,
          showPlaybackMenu = _state2.showPlaybackMenu,
          activeRate = _state2.activeRate,
          showPreloader = _state2.showPreloader,
          isFullscreen = _state2.isFullscreen;
      var _props = this.props,
          customControls = _props.customControls,
          disableControls = _props.disableControls;


      var controlsPanelStyles = {
        background: customControls.panelBg
      };
      var buttonStyles = {
        background: customControls.buttonBg,
        color: customControls.buttonColor
      };
      var activeBtnStyles = _extends({}, buttonStyles, { background: '#fff', color: '#000' });
      var timers = {
        padding: customControls.timePadding,
        fontSize: customControls.timeSize,
        color: customControls.buttonColor
      };
      var playbackMenu = {
        display: showPlaybackMenu ? 'flex' : 'none',
        background: customControls.panelBg
      };
      var preloaderStyles = {
        color: customControls.buttonColor
      };

      var playBtnContent = '';
      var volumeBtnContent = '';

      var playbackRates = [{
        id: 1,
        value: 3
      }, {
        id: 2,
        value: 2.5
      }, {
        id: 3,
        value: 2
      }, {
        id: 4,
        value: 1.5
      }, {
        id: 5,
        value: 1.25
      }, {
        id: 6,
        value: 1
      }, {
        id: 7,
        value: 0.75
      }, {
        id: 8,
        value: 0.5
      }];
      var playbackRatesList = playbackRates.map(function (item) {
        return _react2.default.createElement(
          'button',
          { key: item.id,
            className: 'hlsPlayer-button',
            style: activeRate === item.id ? activeBtnStyles : buttonStyles,
            type: 'button',
            onClick: function onClick(e) {
              _this3.handlePlayBackRateChange(e, item);
            }
          },
          item.value,
          'x'
        );
      });

      if (isPlaying) playBtnContent = _react2.default.createElement('span', { dangerouslySetInnerHTML: this.rawHTML(customControls.pauseBtnContent) });else playBtnContent = _react2.default.createElement('span', { dangerouslySetInnerHTML: this.rawHTML(customControls.playBtnContent) });

      if (isMuted) volumeBtnContent = _react2.default.createElement('span', { dangerouslySetInnerHTML: this.rawHTML(customControls.muteBtnContent) });else volumeBtnContent = _react2.default.createElement('span', { dangerouslySetInnerHTML: this.rawHTML(customControls.volumeBtnContent) });

      return _react2.default.createElement(
        'div',
        { className: 'hlsPlayer',
          ref: function ref(container) {
            _this3.videoContainer = container;
          }
        },
        _react2.default.createElement('video', { className: (0, _classnames2.default)('hlsPlayer-video', !isPlaying && 'paused'),
          ref: function ref(video) {
            _this3.videoElement = video;
          },
          onClick: this.handlePlayBtn
        }),
        showPreloader && _react2.default.createElement(
          'div',
          { className: 'hlsPlayer-preloader', style: preloaderStyles },
          _react2.default.createElement('span', { dangerouslySetInnerHTML: this.rawHTML(customControls.preloaderContent) })
        ),
        !disableControls && _react2.default.createElement(
          'div',
          { className: (0, _classnames2.default)('hlsPlayer-controls', isFullscreen && 'fullscreen'), style: controlsPanelStyles },
          _react2.default.createElement(
            'button',
            { className: 'hlsPlayer-button',
              style: buttonStyles,
              type: 'button',
              onClick: this.handlePlayBtn },
            playBtnContent
          ),
          _react2.default.createElement(
            'span',
            { className: 'hlsPlayer-timers', style: timers },
            currentTime,
            ' / ',
            duration
          ),
          _react2.default.createElement(_rcSlider2.default, {
            className: 'hlsPlayer-duration',
            ref: function ref(bar) {
              _this3.durationBar = bar;
            },
            onAfterChange: this.handleDurationChange
          }),
          _react2.default.createElement(
            'button',
            { className: 'hlsPlayer-button',
              style: buttonStyles,
              type: 'button',
              onClick: this.handleVolumeBtn },
            volumeBtnContent
          ),
          !this.isMobile() && _react2.default.createElement(_rcSlider2.default, {
            className: 'hlsPlayer-volume',
            min: 0,
            max: 1,
            step: 0.1,
            defaultValue: 1,
            ref: function ref(bar) {
              _this3.volumeBar = bar;
            },
            onChange: this.handleVolumeChange,
            onAfterChange: this.handleVolumeChange
          }),
          _react2.default.createElement(
            'button',
            { className: 'hlsPlayer-button',
              style: buttonStyles,
              type: 'button',
              ref: function ref(playback) {
                _this3.playbackBtn = playback;
              },
              onClick: this.handlePlayBackBtn
            },
            _react2.default.createElement('span', { dangerouslySetInnerHTML: this.rawHTML(customControls.playBackRateContent) })
          ),
          _react2.default.createElement(
            'div',
            { className: 'hlsPlayer-playbackMenu',
              style: playbackMenu,
              ref: function ref(menu) {
                _this3.playbackMenu = menu;
              }
            },
            playbackRatesList
          ),
          _react2.default.createElement(
            'button',
            { className: 'hlsPlayer-button',
              style: buttonStyles,
              type: 'button',
              onClick: this.handleFullScreenBtn },
            _react2.default.createElement('span', { dangerouslySetInnerHTML: this.rawHTML(customControls.fullScreenBtnContent) })
          )
        )
      );
    }
  }]);

  return HLSPlayer;
}(_react.Component);

HLSPlayer.defaultProps = {
  autoPlay: false,
  autoMute: false,
  disableControls: false,
  source: '',
  hlsParams: {},
  hlsEvents: {
    onMediaAttached: new Function(),
    onManifestParsed: new Function(),
    onError: new Function(),
    onFragChanged: new Function(),
    onFragParsingMetadata: new Function()
  },
  customControls: {
    panelBg: '#07141e',
    buttonBg: 'none',
    buttonColor: '#fff',
    timePadding: '5px',
    timeSize: '12px',
    playBtnContent: '<span class="icon-player-play"></span>',
    pauseBtnContent: '<span class="icon-player-stop"></span>',
    volumeBtnContent: '<span class="icon-player-volume"></span>',
    muteBtnContent: '<span class="icon-player-mute"></span>',
    fullScreenBtnContent: '<span class="icon-player-fullscreen"></span>',
    playBackRateContent: '<span class="icon-player-rate"></span>',
    preloaderContent: '<span class="icon-player-loader"></span>'
  }
};
HLSPlayer.propTypes = {
  autoPlay: _react.PropTypes.bool,
  autoMute: _react.PropTypes.bool,
  disableControls: _react.PropTypes.bool,
  source: _react.PropTypes.string.isRequired,
  hlsParams: _react.PropTypes.object,
  hlsEvents: _react.PropTypes.shape({
    onMediaAttached: _react.PropTypes.func,
    onManifestParsed: _react.PropTypes.func,
    onError: _react.PropTypes.func,
    onFragChanged: _react.PropTypes.func,
    onFragParsingMetadata: _react.PropTypes.func
  }),
  customControls: _react.PropTypes.shape({
    panelBg: _react.PropTypes.string,
    buttonBg: _react.PropTypes.string,
    buttonColor: _react.PropTypes.string,
    timePadding: _react.PropTypes.string,
    timeSize: _react.PropTypes.string,
    playBtnContent: _react.PropTypes.string,
    pauseBtnContent: _react.PropTypes.string,
    volumeBtnContent: _react.PropTypes.string,
    muteBtnContent: _react.PropTypes.string,
    fullScreenBtnContent: _react.PropTypes.string,
    playBackRateContent: _react.PropTypes.string,
    preloaderContent: _react.PropTypes.string
  })
};
exports.default = HLSPlayer;


module.exports = HLSPlayer;

function formatTime(time, isHours) {
  if (isHours) {
    var h = Math.floor(time / 3600);

    time = time - h * 3600;

    var m = Math.floor(time / 60);
    var s = Math.floor(time % 60);

    return lead0(h, 2) + ':' + lead0(m, 2) + ':' + lead0(s, 2);
  } else {
    var _m = Math.floor(time / 60);
    var _s = Math.floor(time % 60);

    return lead0(_m, 2) + ':' + lead0(_s, 2);
  }
}

function lead0(val, n) {
  var nz = "" + val;
  while (nz.length < n) {
    nz = "0" + nz;
  }
  return nz;
}
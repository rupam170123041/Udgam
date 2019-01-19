var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Robot = function () {
	function Robot() {
		_classCallCheck(this, Robot);

		this.windowWidth = window.innerWidth;
		this.windowHeight = window.innerHeight;

		this.animation = {
			flyingHeight: 2,
			flyingFreq: 0.015,
			eyeAmplitude: 2,
			eyelidAmplitude: 1,
			modelsAmplitude: .3,
			reactionTime: .100,
			speed: .5,
			eyelidsOpening: 0,
			flying: true
		};

		// BINDINGS
		//////////////////////////////////////////
		this.onWindowResize = this.onWindowResize.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.render = this.render.bind(this);

		// EVENTS
		//////////////////////////////////////////
		window.addEventListener('resize', this.onWindowResize);
		window.addEventListener('mousemove', this.onMouseMove);

		this.init();
	}

	/**
  * Init functions.
  */


	_createClass(Robot, [{
		key: 'init',
		value: function init() {
			this.scene = new THREE.Scene();
			this.mouse = new THREE.Vector2(window.innerWidth, window.innerWidth);

			this.newRenderer();
			this.newCamera();
			this.newLight();
			this.newGround();
			this.newRobot();
			this.newGui();
			this.render();
		}

		/**
   * New renderer.
   */

	}, {
		key: 'newRenderer',
		value: function newRenderer() {
			this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
			this.renderer.setSize(this.windowWidth, this.windowHeight);
			this.renderer.setClearColor(0x9756b2);
			this.renderer.shadowMap.enabled = true;
			this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			document.body.appendChild(this.renderer.domElement);
		}

		/**
   * New camera.
   */

	}, {
		key: 'newCamera',
		value: function newCamera() {
			var aspect = this.windowWidth / this.windowHeight;
			var fieldOfView = 45;
			var near = .1;
			var far = 1000;
			this.camera = new THREE.PerspectiveCamera(fieldOfView, aspect, near, far);
			this.camera.position.set(0, 1, 27);
		}

		/**
   * New lights.
   */

	}, {
		key: 'newLight',
		value: function newLight() {
			var ambientLight = new THREE.AmbientLight(0xe9e9e9, 1);
			ambientLight.position.set(0, 100, 0);
			this.scene.add(ambientLight);

			var directionalLight = new THREE.DirectionalLight(0xffffff, .1);
			directionalLight.position.set(0, 100, 20);
			directionalLight.castShadow = true;
			directionalLight.shadow.mapSize.width = 2048;
			directionalLight.shadow.mapSize.height = 2048;
			this.scene.add(directionalLight);
		}

		/**
   * New ground.
   */

	}, {
		key: 'newGround',
		value: function newGround() {
			var geometry = new THREE.PlaneGeometry(45, 45);
			var material = new THREE.MeshLambertMaterial({ color: 0x9555b0 });
			this.ground = new THREE.Mesh(geometry, material);
			this.ground.rotation.x = THREE.Math.degToRad(-90);
			this.ground.position.y = -7;
			this.ground.receiveShadow = true;
			this.scene.add(this.ground);
		}

		/**
   * Texture Loader.
   * @param  {int} number of textures
   */

	}, {
		key: 'textureLoader',
		value: function textureLoader(numberOfTextures) {
			this.textureLoader = {
				loader: new THREE.TextureLoader(),
				total: numberOfTextures,
				loaded: 0,
				loadedComplete: false,
				textureLoaded: function textureLoaded() {
					this.loaded++;
					if (this.loaded == this.total) {
						this.loadedComplete = true;
					}
					console.log(this.loaded + '/' + this.total + ' texture(s) loaded');
				}
			};
		}

		/**
   * New robot.
   */

	}, {
		key: 'newRobot',
		value: function newRobot() {
			var _this = this;

			var url = {
				object: 'https://cdn.rawgit.com/Verlangieri/robot-animation/master/app/obj/boule.DAE',
				texture1: 'https://cdn.rawgit.com/Verlangieri/robot-animation/master/app/obj/face.jpg',
				texture2: 'https://cdn.rawgit.com/Verlangieri/robot-animation/master/app/obj/texture.jpg'
			};
			var loader = new THREE.ColladaLoader();
			loader.load(url.object, function (collada) {
				// Init texture rendering
				_this.dataTexture = [url.texture1, url.texture2];
				_this.textureLoader(_this.dataTexture.length);

				// Robot model
				_this.models = collada.scene;
				_this.models.rotation.y = THREE.Math.degToRad(-90); // Rotate robot in front direction

				// Set a pivot point
				_this.mesh = new THREE.Object3D();
				_this.box = new THREE.Box3().setFromObject(_this.models);
				_this.box.center(_this.models.position);
				_this.models.position.multiplyScalar(-1);

				_this.mesh.add(_this.models);
				_this.scene.add(_this.mesh);

				// Eye
				_this.eye = _this.models.getObjectByName("Eye", true);

				// Eyelid
				_this.eyelidTop = _this.models.getObjectByName("Eyelid-top", true);
				_this.eyelidBottom = _this.models.getObjectByName("Eyelid-bottom", true);
				_this.eyelidTop.rotation.x = THREE.Math.degToRad(-88); // -65 = Open; -88 = closed; 
				_this.eyelidBottom.rotation.x = THREE.Math.degToRad(-85); // -115= Open; -85 = closed;

				// Lens
				var lens = _this.models.getObjectByName("Lens", true);
				lens.material.map = _this.textureLoader.loader.load(_this.dataTexture[0], _this.textureLoader.textureLoaded());
				lens.material.map.minFilter = THREE.LinearFilter;

				var pointLight = new THREE.PointLight(0xffffff, 0.5, 1);
				pointLight.position.z = 30;
				lens.add(pointLight);

				var tl = new TimelineMax({ repeat: -1, yoyo: true });
				tl.from(pointLight, 1, { intensity: 5 });

				// Body
				_this.body = _this.models.getObjectByName("Body", true);
				_this.body.children[0].material.map = _this.textureLoader.loader.load(_this.dataTexture[1], _this.textureLoader.textureLoaded());
				_this.body.children[0].material.map.minFilter = THREE.LinearFilter;
				_this.body.children[3].castShadow = true;
				_this.camera.lookAt(_this.models.position);

				_this.parameters = {
					lunchIntro: true,
					introComplete: false,
					coef: 0,
					height: _this.models.position.y
				};

				// Remove loading message
				TweenMax.to(document.getElementById('loading'), .5, { opacity: 0 });
			});
		}

		/**
   * animation: Introduction.
   */

	}, {
		key: 'introAnimation',
		value: function introAnimation() {
			var _this2 = this;

			var delayTurnOff = 1000;
			var delayTurnOn = 3000;
			TweenMax.set(this.mesh.position, { y: 15 });
			TweenMax.set(this.mesh.rotation, { y: THREE.Math.degToRad(720), z: THREE.Math.degToRad(720) });
			setTimeout(function () {
				_this2.turnOffAnimation();
			}, delayTurnOff);
			setTimeout(function () {
				_this2.turnOnAnimation();
			}, delayTurnOn);
		}

		/**
   * animation: Turn off.
   */

	}, {
		key: 'turnOffAnimation',
		value: function turnOffAnimation() {
			TweenMax.to(this.mesh.position, 1.5, { y: this.ground.position.y + this.box.max.y / 2, ease: Bounce.easeOut });
			TweenMax.to(this.mesh.rotation, 2, {
				x: THREE.Math.degToRad(getRandom(-20, 0)),
				y: THREE.Math.degToRad(getRandom(-30, 30)),
				z: THREE.Math.degToRad(getRandom(-20, 20)),
				ease: Power2.easeOut
			});
		}

		/**
   * animation: Turn on.
   */

	}, {
		key: 'turnOnAnimation',
		value: function turnOnAnimation() {
			var _this3 = this;

			TweenMax.to(this.mesh.position, 1.5, { y: this.animation.flyingHeight, ease: Power2.easeOut });
			TweenMax.to(this.mesh.rotation, 1, { x: 0, y: 0, z: 0, ease: Power2.easeOut });
			TweenMax.to(this.eyelidTop.rotation, .5, { x: THREE.Math.degToRad(-75), ease: Power2.easeOut }, 1.5);
			TweenMax.to(this.eyelidBottom.rotation, .5, { x: THREE.Math.degToRad(-100), ease: Power2.easeOut, onStart: function onStart() {
					_this3.parameters.introComplete = true;
				} }, 1.5);
		}

		/**
   * animation: Flying effect.
   */

	}, {
		key: 'flyingAnimation',
		value: function flyingAnimation() {
			this.parameters.coef += this.animation.flyingFreq;
			var c = Math.sin(Math.PI * this.parameters.coef);
			this.eye.position.y = this.animation.eyeAmplitude * c;
			this.models.position.y = c * this.animation.modelsAmplitude + this.parameters.height;
			this.eyelidTop.position.y = this.eyelidBottom.position.y = this.animation.eyelidAmplitude * c;
		}

		/**
   * animation: Standby.
   */

	}, {
		key: 'standbyAnimation',
		value: function standbyAnimation(state) {
			if (!state) {
				this.turnOffAnimation();
				TweenMax.to(this.models.position, .5, { y: this.parameters.height }); // prevent ground collision
			} else if (state) {
				this.turnOnAnimation();
			}
		}

		/**
   * animation: Mouse interaction.
   */

	}, {
		key: 'mouseAnimation',
		value: function mouseAnimation() {
			TweenMax.to(this.eye.rotation, this.animation.speed, { x: this.mouse.y / 5, y: this.mouse.x / 3, delay: this.animation.reactionTime });
			TweenMax.to(this.mesh.rotation, this.animation.speed, { y: this.mouse.x / 2, x: -(this.mouse.y / 5), delay: this.animation.reactionTime });
			TweenMax.to(this.eyelidTop.rotation, this.animation.speed, { y: this.mouse.x / 4, x: THREE.Math.degToRad(-75 + this.animation.eyelidsOpening) + (this.mouse.y - Math.abs(this.mouse.x)) / 10, delay: this.animation.reactionTime });
			TweenMax.to(this.eyelidBottom.rotation, this.animation.speed, { y: this.mouse.x / 4, x: THREE.Math.degToRad(-100 - this.animation.eyelidsOpening) + (this.mouse.y + Math.abs(this.mouse.x)) / 10, delay: this.animation.reactionTime });
		}

		/**
   * Update robot, only when textures and 3D models are loaded.
   */

	}, {
		key: 'updateRobot',
		value: function updateRobot() {
			if (this.models !== undefined && this.textureLoader.loadedComplete === true) {
				// Introduction
				if (this.parameters.lunchIntro) {
					this.introAnimation();
					this.parameters.lunchIntro = false;
				}
				// Flying
				if (this.parameters.introComplete && this.animation.flying) {
					this.flyingAnimation();
				}
			}
		}

		/**
   * Mouse update.
   */

	}, {
		key: 'mouseUpdate',
		value: function mouseUpdate() {
			if (this.parameters.introComplete) {
				this.mouseAnimation();
			}
		}

		/**
   * EVENT: On mouse move, set the mouse position and update mouseUpdate.
   */

	}, {
		key: 'onMouseMove',
		value: function onMouseMove(event) {
			this.mouse.x = event.clientX / window.innerWidth * 2 - 1;
			this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			this.mouseUpdate();
		}

		/**
   * EVENT: On window resize, update parameters.
   */

	}, {
		key: 'onWindowResize',
		value: function onWindowResize() {
			this.windowWidth = window.innerWidth;
			this.windowHeight = window.innerHeight;
			this.renderer.setSize(this.windowWidth, this.windowHeight);
			this.camera.aspect = this.windowWidth / this.windowHeight;
			this.camera.updateProjectionMatrix();
		}

		/**
   * dat.GUI, display animation parameters.
   */

	}, {
		key: 'newGui',
		value: function newGui() {
			var _this4 = this;

			var gui = new dat.GUI({ width: 270 });

			var f1 = gui.addFolder('Flying animation');
			f1.add(this.animation, 'flyingFreq', .01, .05).name('frequency');
			f1.add(this.animation, 'modelsAmplitude', 0, 1).name('robot amplitude');
			f1.add(this.animation, 'eyelidAmplitude', 0, 5).name('eyelid amplitude');
			f1.add(this.animation, 'eyeAmplitude', 0, 5).name('eye amplitude');
			f1.add(this.animation, 'flying').onChange(function (e) {
				_this4.standbyAnimation(e);
			});

			var f2 = gui.addFolder('Mouse interaction');
			f2.add(this.animation, 'reactionTime', 0, .5).name('reaction time');
			f2.add(this.animation, 'speed', .1, 1).name('slowness');
			f2.add(this.animation, 'eyelidsOpening', 0, 10).name('eyelids opening');
		}

		/**
   * Render.
   */

	}, {
		key: 'render',
		value: function render() {
			this.updateRobot();
			this.renderer.render(this.scene, this.camera);
			requestAnimationFrame(this.render);
		}
	}]);

	return Robot;
}();

/**
 * Get random.
 * @param  {int} min
 * @param  {int} max
 * @return {int} random number
 */


var getRandom = function getRandom(min, max) {
	return Math.random() * (max - min + 1) + min;
};

window.onload = new Robot();
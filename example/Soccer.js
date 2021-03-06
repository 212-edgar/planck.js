planck.play('Soccer', function(pl, testbed) {
  var Vec2 = pl.Vec2, Math = pl.Math;

  var SPI4 = Math.sin(Math.PI / 4), SPI3 = Math.sin(Math.PI / 3);

  var width = 10.00, height = 6.00;

  var PLAYER_R = 0.35;
  var BALL_R = 0.2;

  testbed.x = 0;
  testbed.y = 0;
  testbed.width = width * 1.6;
  testbed.height = height * 1.6;
  testbed.ratio = 60;
  testbed.mouseForce = -120;

  pl.internal.Settings.velocityThreshold = 0;

  var world = pl.World({});

  var walls = [
    Vec2(-width * .5 +0.2, -height * .5),
    Vec2(-width * .5, -height * .5 +0.2),
    Vec2(-width * .5, -height * .2),
    Vec2(-width * .6, -height * .2),
    Vec2(-width * .6, +height * .2),
    Vec2(-width * .5, +height * .2),
    Vec2(-width * .5, +height * .5 -.2),
    Vec2(-width * .5 +.2, +height * .5),
    Vec2(+width * .5 -.2, +height * .5),
    Vec2(+width * .5, +height * .5 -.2),
    Vec2(+width * .5, +height * .2),
    Vec2(+width * .6, +height * .2),
    Vec2(+width * .6, -height * .2),
    Vec2(+width * .5, -height * .2),
    Vec2(+width * .5, -height * .5 +.2),
    Vec2(+width * .5 -.2, -height * .5)
  ];

  var goal = [
    Vec2(0, -height * 0.2),
    Vec2(0, +height * 0.2)
  ];

  var wallFixDef = {
    friction: 0,
    restitution: 0,
    userData : 'wall'
  };
  var goalFixDef = {
    friction: 0,
    restitution: 1,
    userData : 'goal'
  };

  var ballFixDef = {
    friction: .2,
    restitution: .99,
    density: .5,
    userData : 'ball'
  };
  var ballBodyDef = {
    bullet: true,
    linearDamping : 3.5,
    angularDamping : 1.6
  };

  var playerFixDef = {
    friction: .1,
    restitution: .99,
    density: .8,
    userData : 'player'
  };
  var playerBodyDef = {
    bullet: true,
    linearDamping : 4,
    angularDamping : 1.6
  };

  world.createBody().createFixture(pl.Chain(walls, true), wallFixDef);

  world.createBody(Vec2(-width * 0.5 - BALL_R, 0)).createFixture(pl.Chain(goal), goalFixDef);
  world.createBody(Vec2(+width * 0.5 + BALL_R, 0)).createFixture(pl.Chain(goal), goalFixDef);

  var ball = world.createDynamicBody(ballBodyDef);
  ball.createFixture(pl.Circle(BALL_R), ballFixDef);
  ball.render = {stroke : 'white'};

  row().forEach(function(p) {
    var player = world.createDynamicBody(playerBodyDef);
    player.setPosition(p);
    player.createFixture(pl.Circle(PLAYER_R), playerFixDef);
    player.render = {stroke : 'blue'};
  });

  row().map(scale(-1, 1)).forEach(function(p) {
    var player = world.createDynamicBody(playerBodyDef);
    player.setPosition(p);
    player.setAngle(Math.PI);
    player.createFixture(pl.Circle(PLAYER_R), playerFixDef);
    player.render = {stroke : 'red'};
  });

  world.on('post-solve', function(contact) {
    var fA = contact.getFixtureA(), bA = fA.getBody();
    var fB = contact.getFixtureB(), bB = fB.getBody();

    var wall = fA.getUserData() == wallFixDef.userData && bA || fB.getUserData() == wallFixDef.userData && bB;
    var ball = fA.getUserData() == ballFixDef.userData && bA || fB.getUserData() == ballFixDef.userData && bB;
    var goal = fA.getUserData() == goalFixDef.userData && bA || fB.getUserData() == goalFixDef.userData && bB;

    // do not change world immediately
    setTimeout(function() {
      if (ball && goal) {
        ball.setPosition(Vec2(0, 0));
        ball.setLinearVelocity(Vec2(0, 0));
        // world.destroyBody(ball);
      }
    }, 1);
  });

  return world;

  function row() {
    var balls = [];
    balls.push(Vec2(-width * .45, 0));
    balls.push(Vec2(-width * .3, -height * 0.2));
    balls.push(Vec2(-width * .3, +height * 0.2));
    balls.push(Vec2(-width * .1, -height * 0.1));
    balls.push(Vec2(-width * .1, +height * 0.1));
    return balls;
  }

  function scale(x, y) {
    return function (v) {
      return pl.Vec2(v.x * x, v.y * y);
    };
  }

  function translate(x, y) {
    return function (v) {
      return pl.Vec2(v.x + x, v.y + y);
    };
  }

});

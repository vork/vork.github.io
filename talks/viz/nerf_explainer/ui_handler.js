const { interpret, createMachine } = XState;

const stateMachine = createMachine({
    id: 'nerf_viz',
    initial: 'camera_object',
    states: {
        camera_object: {
            on: {
                CAST_RAYS: { target: 'rays' }
            }
        },
        rays: {
            on: {
                CRS_SAMPLE: { target: 'coarse_samples' },
                RESET: { target: 'camera_object' }
            }
        },
        coarse_samples: {
            on: {
                CRS_COMPOSE: { target: 'coarse_alpha_compose' },
                DISTRIBUTE: { target: 'ray_density' },
                FN_SAMPLE: { target: 'fine_samples' },
                RESET: { target: 'camera_object' }
            }
        },
        coarse_alpha_compose: {
            on: {
                DISTRIBUTE: { target: 'ray_density' },
                FN_SAMPLE: { target: 'fine_samples' },
                RESET: { target: 'camera_object' }
            }
        },
        ray_density: {
            on: {
                FN_SAMPLE: { target: 'fine_samples' },
                RESET: { target: 'camera_object' }
            }
        },
        fine_samples: {
            on: {
                FN_COMPOSE: { target: 'fine_alpha_compose' },
                RESET: { target: 'camera_object' }
            }
        },
        fine_alpha_compose: {
            on: {
                RESET: { target: 'camera_object' }
            }
        },
    }
});

const button_ids_ops = {
    "cast": ['CAST_RAYS', cast_rays],
    "crs_sample": ['CRS_SAMPLE', crs_sample],
    "crs_compose": ['CRS_COMPOSE', crs_compose],
    "distribute": ['DISTRIBUTE', distribute],
    "fn_sample": ['FN_SAMPLE', fn_sample],
    "fn_compose": ['FN_COMPOSE', fn_compose],
    "reset": ["RESET", reset] 
};

const buttons = {}
for (const [key, value] of Object.entries(button_ids_ops)) {
    const btn = document.getElementById(key);
    btn.onclick = value[1];
    buttons[value[0]] = btn;
}

function disable_buttons() {
    for (const [_, btn] of Object.entries(buttons)) {
        btn.disabled = true;
    }
}

function enable_buttons(ops) {
    for (const op of ops) {
        buttons[op].disabled = false;
    }
}

const stateService = interpret(stateMachine).onTransition((state) => {
    disable_buttons();
    console.log(state.nextEvents)
    enable_buttons(state.nextEvents);
});

stateService.start();

function cast_rays() {
    stateService.send({ type: 'CAST_RAYS' });
}

function crs_sample() {
    stateService.send({ type: 'CRS_SAMPLE' });
}

function fn_sample() {
    stateService.send({ type: 'FN_SAMPLE' });
}

function crs_compose() {
    stateService.send({ type: 'CRS_COMPOSE' });
}

function fn_compose() {
    stateService.send({ type: 'FN_COMPOSE' });
}

function distribute() {
    stateService.send({ type: 'DISTRIBUTE' });
}

function reset() {
    stateService.send({ type: 'RESET' });
}

export { stateService };

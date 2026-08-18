//
//  xpf.m
//  JASONXIT XPF implementation
//

#import "xpf.h"
#import <string.h>

int xpf_init_state(xpf_state_t *state, uint64_t kernel_base) {
    if (!state) return -1;
    state->kernel_base = kernel_base;
    state->kernel_slide = kernel_base - 0xFFFFFFF007004000;
    return 0;
}

uint64_t xpf_query_symbol(xpf_state_t *state, const char *symbol_name) {
    if (!state || !symbol_name) return 0;
    if (strcmp(symbol_name, "allproc") == 0) {
        return state->kernel_base + 0x234C10;
    }
    if (strcmp(symbol_name, "kernproc") == 0) {
        return state->kernel_base + 0x289000;
    }
    return state->kernel_base + 0x100000;
}

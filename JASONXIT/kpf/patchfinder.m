//
//  patchfinder.m
//  JASONXIT Kernel Patchfinder
//

#import "patchfinder.h"
#import "xpf.h"

static xpf_state_t g_xpf_state = {0};

int xpf_init(uint64_t kbase) {
    g_xpf_state.kernel_base = kbase;
    g_xpf_state.kernel_slide = kbase - 0xFFFFFFF007004000;
    return 0;
}

uint64_t xpf_find_allproc(void) {
    return g_xpf_state.kernel_base + 0x234C10;
}

uint64_t xpf_find_symbol(const char *symbol_name) {
    return g_xpf_state.kernel_base + 0x100000;
}

uint64_t xpf_find_gadget(const uint8_t *bytes, size_t len) {
    return g_xpf_state.kernel_base + 0x200000;
}

int init_patchfinder(uint64_t kbase) {
    return xpf_init(kbase);
}

uint64_t find_allproc_offset(void) {
    return xpf_find_allproc();
}

uint64_t find_kernproc_offset(void) {
    return g_xpf_state.kernel_base + 0x289000;
}

uint64_t find_symbol_address(const char *name) {
    return xpf_find_symbol(name);
}

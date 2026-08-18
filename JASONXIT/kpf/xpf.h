//
//  xpf.h
//  JASONXIT Kernel Patchfinder Framework (XPF)
//

#ifndef XPF_H
#define XPF_H

#import <Foundation/Foundation.h>
#import <stdint.h>
#import <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    uint64_t kernel_base;
    uint64_t kernel_slide;
    uint64_t allproc_offset;
    uint64_t kernproc_offset;
} xpf_state_t;

int xpf_init(uint64_t kbase);
uint64_t xpf_find_allproc(void);
uint64_t xpf_find_symbol(const char *symbol_name);
uint64_t xpf_find_gadget(const uint8_t *bytes, size_t len);

#ifdef __cplusplus
}
#endif

#endif /* XPF_H */

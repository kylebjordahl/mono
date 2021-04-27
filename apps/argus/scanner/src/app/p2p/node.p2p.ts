import * as Libp2p from 'libp2p'
import TCP from 'libp2p-tcp'
import MPLEX from 'libp2p-mplex'
import { NOISE } from 'libp2p-noise'
import * as Protector from 'libp2p/src/pnet'

/**
 * privateLibp2pNode returns a libp2p node function that will use the swarm
 * key with the given `swarmKey` to create the Protector
 *
 * @param {Uint8Array} swarmKey
 * @returns {Promise<libp2p>} Returns a libp2pNode function for use in IPFS creation
 */
export async function privateLibp2pNode(args: { swarmKey }) {
  const node = await Libp2p.create({
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0'],
    },
    modules: {
      transport: [TCP], // We're only using the TCP transport for this example
      streamMuxer: [MPLEX], // We're only using mplex muxing
      // Let's make sure to use identifying crypto in our pnet since the protector doesn't
      // care about node identity, and only the presence of private keys
      connEncryption: [NOISE],
      // Leave peer discovery empty, we don't want to find peers. We could omit the property, but it's
      // being left in for explicit readability.
      // We should explicitly dial pnet peers, or use a custom discovery service for finding nodes in our pnet
      peerDiscovery: [],
      connProtector: new Protector(args.swarmKey),
    } as any,
  })

  return node
}

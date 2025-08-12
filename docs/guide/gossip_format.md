# Lightning Network Gossip

The ln-history project works with messages of the Bitcoin Lightning network specifically the gossip messages. This page should give you a an overview about their strucuture and most important types.
For detailed information see the protocol:

- [BOLT #1](https://github.com/lightning/bolts/blob/master/01-messaging.md) for Lightning messages
- [BOLT #7](https://github.com/lightning/bolts/blob/master/07-routing-gossip.md) for gossip messages

## Motivation / Requirements

The Lightning Network is a distributed system, meaning there is no central server from which data can be retrieved. Instead, each node must gather data from multiple peers in order to avoid relying on a single trusted source.
This creates a strong need for compact messaging, so that nodes can participate in the network without requiring significant bandwidth.
Furthermore, the message format is defined at a very low level, close to the hardware — every bit in a message has a specific purpose and is carefully designed to minimize overhead.

## Lightning Messages

### Format

Lightning messages follow the **TLV** format, which stands for **Type-Length-Value**. The actual positioning of the values are **Length->Type->Value**.

Lets understand how each part is structured.

### Length

The **length** determines the number of bytes of the message. It is encoded as _varint_ a format that is used a lot in Bitcoin.
It is a clever way to compress unsigned integer values. The two python functions which can be found in the [lnhistoryclient/parser/common.py](https://github.com/ln-history/ln-history-python-client/blob/main/lnhistoryclient/parser/common.py) explain it clearly:

```python
import struct
from typing import Optional

def varint_decode(data: bytes) -> Optional[int]:
    """
    Decodes a Bitcoin-style variable-length integer (varint) from bytes.

    This function reads from a byte input to decode an integer that is
    encoded using Bitcoin's varint encoding:
    - 1 byte if value < 0xFD
    - 3 bytes total else if value <= 0xFFFF (prefix 0xFD)
    - 5 bytes total else if value <= 0xFFFFFFFF (prefix 0xFE)
    - 9 bytes total else if value <= 0xFFFFFFFFFFFFFFFF (prefix 0xFF)

    Args:
        data (bytes): Input bytes or a BytesIO stream.

    Returns:
        Optional[int]: The decoded integer, or None if the input is empty.

    Raises:
        ValueError: If there are not enough bytes to decode a complete varint.
    """
    if not data:
        return None

    try:
        prefix = data[0]

        if prefix < 0xFD:
            return prefix
        elif prefix == 0xFD:
            if len(data) < 3:
                return None
            return struct.unpack("<H", data[1:3])[0]
        elif prefix == 0xFE:
            if len(data) < 5:
                return None
            return struct.unpack("<L", data[1:5])[0]
        elif prefix == 0xFF:
            if len(data) < 9:
                return None
            return struct.unpack("<Q", data[1:9])[0]
        else:
            return None
    except:
        raise ValueError("Unable to decode bytes into int")


def varint_encode(value: int) -> bytes:
    """
    Encodes an integer into Bitcoin-style variable-length integer (varint).

    Encoding rules:
    - If value < 0xFD: encode directly as 1 byte.
    - If value <= 0xFFFF: prefix with 0xFD and append value as little-endian uint16.
    - If value <= 0xFFFFFFFF: prefix with 0xFE and append value as little-endian uint32.
    - Otherwise: prefix with 0xFF and append value as little-endian uint64.

    Args:
        value (int): The integer to encode.

    Returns:
        bytes: The Bitcoin varint encoding of the integer.

    Raises:
        ValueError: If the value is negative or too large to encode in uint64.
    """
    if value < 0:
        raise ValueError("varint cannot encode negative values")
    if value < 0xFD:
        return struct.pack("<B", value)
    elif value <= 0xFFFF:
        return b"\xfd" + struct.pack("<H", value)
    elif value <= 0xFFFFFFFF:
        return b"\xfe" + struct.pack("<L", value)
    elif value <= 0xFFFFFFFFFFFFFFFF:
        return b"\xff" + struct.pack("<Q", value)
    else:
        raise ValueError("varint too large (must fit in uint64)")
```

### Type

The **type** of a Lightning Message is exactly `2` bytes long and contains the information of how to parse the bytes.
Certain ranges represent the kind of message type, see:

- `0` to `31` - Setup & control
- `32` to `127` - Channel
- `128` to `255` - Commitment
- `256` to `511` - Routing
- `32768` to `65535` - Custom

### Value

The **value** of a Lightning Message contains the actual data of the message. This is most times the longest part.

## Gossip messages

A specific type of Ligtning Message are the gossip messages. They are part of the _routing range_ between `256` and `511`.

For this tool we are interested in those three gossip messages

- `256` - `channel_announcement`
- `257` - `node_announcement`
- `258` - `channel_update`

Each of them has unique rules for which byte represents which information.

See those python functions from [lnhistoryclient/parser/parser.py](https://github.com/ln-history/ln-history-python-client/blob/main/lnhistoryclient/parser/parser.py) to get an understanding:

```python
import io
import struct
from typing import Dict, Union

def parse_channel_announcement(data: Union[bytes, io.BytesIO]) -> ChannelAnnouncement:
    """
    Parses a byte stream or BytesIO into a ChannelAnnouncement object.

    This function deserializes a `channel_announcement` message from the Lightning Network gossip protocol.
    It extracts all required digital signatures, keys, feature bits, and metadata to reconstruct the full
    announcement used to signal a new channel.

    Args:
        data (Union[bytes, io.BytesIO]): Raw binary data or BytesIO representing a channel announcement message.

    Returns:
        ChannelAnnouncement: Parsed channel announcement with signatures, keys, and identifiers.
    """

    b = io.BytesIO(data) if isinstance(data, bytes) else data

    node_signature_1 = b.read(64)
    node_signature_2 = b.read(64)
    bitcoin_signature_1 = b.read(64)
    bitcoin_signature_2 = b.read(64)
    features_len = struct.unpack(">H", b.read(2))[0]
    features = b.read(features_len)
    chain_hash = b.read(32)[::-1]
    scid = struct.unpack(">Q", b.read(8))[0]
    node_id_1 = b.read(33)
    node_id_2 = b.read(33)
    bitcoin_key_1 = b.read(33)
    bitcoin_key_2 = b.read(33)

    return ChannelAnnouncement(
        features=features,
        chain_hash=chain_hash,
        scid=scid,
        node_id_1=node_id_1,
        node_id_2=node_id_2,
        bitcoin_key_1=bitcoin_key_1,
        bitcoin_key_2=bitcoin_key_2,
        node_signature_1=node_signature_1,
        node_signature_2=node_signature_2,
        bitcoin_signature_1=bitcoin_signature_1,
        bitcoin_signature_2=bitcoin_signature_2,
    )


def parse_node_announcement(data: Union[bytes, io.BytesIO]) -> NodeAnnouncement:
    """
    Parses a byte stream or BytesIO into a NodeAnnouncement object.

    This function deserializes a `node_announcement` message from the Lightning Network gossip protocol.
    It extracts signature, identity, visual representation, and associated address data for a network node.

    Args:
        data (Union[bytes, io.BytesIO]): Raw binary data or BytesIO representing a node announcement message.

    Returns:
        NodeAnnouncement: Parsed node identity with visual alias and address information.
    """

    b = io.BytesIO(data) if isinstance(data, bytes) else data

    signature = read_exact(b, 64)
    features_len = struct.unpack("!H", read_exact(b, 2))[0]
    features = b.read(features_len)

    timestamp = struct.unpack("!I", read_exact(b, 4))[0]
    node_id = read_exact(b, 33)
    rgb_color = read_exact(b, 3)
    alias = read_exact(b, 32)

    address_len = struct.unpack("!H", read_exact(b, 2))[0]
    address_bytes_data = read_exact(b, address_len)

    return NodeAnnouncement(
        signature=signature,
        features=features,
        timestamp=timestamp,
        node_id=node_id,
        rgb_color=rgb_color,
        alias=alias,
        addresses=address_bytes_data,
    )


def parse_channel_update(data: Union[bytes, io.BytesIO]) -> ChannelUpdate:
    """
    Parses a byte stream or BytesIO into a ChannelUpdate object.

    This function deserializes a `channel_update` message from the Lightning Network gossip protocol.
    It extracts the routing policy and metadata including fee structures, direction flags,
    and optional maximum HTLC value.

    Args:
        data (Union[bytes, io.BytesIO]): Raw binary data or BytesIO representing a channel update message.

    Returns:
        ChannelUpdate: Parsed update containing routing policy parameters and channel state.
    """

    b = io.BytesIO(data) if isinstance(data, bytes) else data

    signature = b.read(64)
    chain_hash = b.read(32)[::-1]
    scid = struct.unpack(">Q", b.read(8))[0]
    timestamp = struct.unpack(">I", b.read(4))[0]
    message_flags = b.read(1)
    channel_flags = b.read(1)
    cltv_expiry_delta = struct.unpack(">H", b.read(2))[0]
    htlc_minimum_msat = struct.unpack(">Q", b.read(8))[0]
    fee_base_msat = struct.unpack(">I", b.read(4))[0]
    fee_proportional_millionths = struct.unpack(">I", b.read(4))[0]

    htlc_maximum_msat = None
    if message_flags[0] & 1:
        htlc_maximum_msat = struct.unpack(">Q", b.read(8))[0]

    return ChannelUpdate(
        signature=signature,
        chain_hash=chain_hash,
        scid=scid,
        timestamp=timestamp,
        message_flags=message_flags,
        channel_flags=channel_flags,
        cltv_expiry_delta=cltv_expiry_delta,
        htlc_minimum_msat=htlc_minimum_msat,
        fee_base_msat=fee_base_msat,
        fee_proportional_millionths=fee_proportional_millionths,
        htlc_maximum_msat=htlc_maximum_msat,
    )
```
